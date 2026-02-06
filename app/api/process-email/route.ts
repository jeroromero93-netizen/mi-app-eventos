import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let emailContent = "";
    let subject = "";
    let fromEmail = "";

    // Handle both SendGrid Inbound Parse (multipart/form-data) and JSON (test mode)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const textBody = (formData.get("text") as string) || "";
      const htmlBody = (formData.get("html") as string) || "";
      emailContent =
        textBody ||
        htmlBody
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      subject = (formData.get("subject") as string) || "";
      fromEmail = (formData.get("from") as string) || "";
    } else {
      const body = await request.json();
      emailContent = body.content || body.text || "";
      subject = body.subject || "";
      fromEmail = body.from || "test@manual";
    }

    if (!emailContent.trim()) {
      return NextResponse.json(
        { error: "No email content provided" },
        { status: 400 }
      );
    }

    // Call OpenAI-compatible API directly via fetch (no SDK needed)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI API key not configured" },
        { status: 500 }
      );
    }

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an expert event data extractor for a cultural events agenda in Madrid, Spain.
Extract ALL cultural events from the given text and return a JSON object with this exact structure:
{
  "events": [
    {
      "title": "Event name",
      "date": "YYYY-MM-DD",
      "time": "HH:MM or null",
      "venue": "Venue name or null",
      "description": "Brief description in Spanish, max 200 chars, or null",
      "category": "one of: musica, exposicion, cine, teatro, charla, fiesta, otro",
      "url": "URL or null"
    }
  ],
  "summary": "Brief summary in Spanish of what was extracted"
}
If year is not specified, assume 2026. Always respond with valid JSON only.`,
          },
          {
            role: "user",
            content: `Subject: ${subject}\nFrom: ${fromEmail}\n\nEmail content:\n${emailContent}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", errorText);
      return NextResponse.json(
        { error: "AI processing failed", details: `API returned ${aiResponse.status}` },
        { status: 502 }
      );
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "{}";

    let parsed: { events?: Array<Record<string, string | null>>; summary?: string };
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", details: rawContent },
        { status: 500 }
      );
    }

    if (!parsed.events || parsed.events.length === 0) {
      return NextResponse.json(
        {
          error: "No events could be extracted from the content",
          summary: parsed.summary || "No se pudieron extraer eventos del contenido.",
        },
        { status: 422 }
      );
    }

    // Store extracted events in Supabase
    const supabase = await createClient();
    const storedEvents = [];

    for (const event of parsed.events) {
      const eventData = {
        id: crypto.randomUUID(),
        title: event.title || "Evento sin titulo",
        date: event.date || new Date().toISOString().split("T")[0],
        time: event.time || null,
        venue: event.venue || null,
        description: event.description || null,
        category: event.category || "otro",
        url: event.url || null,
        status: "interested",
      };

      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error("Error storing event:", error);
      } else {
        storedEvents.push(data);
      }
    }

    return NextResponse.json({
      success: true,
      summary: parsed.summary || "Eventos extraidos correctamente.",
      eventsExtracted: parsed.events.length,
      eventsStored: storedEvents.length,
      events: storedEvents,
    });
  } catch (error) {
    console.error("Error processing email:", error);
    return NextResponse.json(
      {
        error: "Error processing email content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

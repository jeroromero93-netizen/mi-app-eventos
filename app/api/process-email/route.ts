import { generateText, Output } from "ai";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().describe("Event title"),
  date: z
    .string()
    .describe("Event date in YYYY-MM-DD format. If year is not specified, assume 2026."),
  time: z.string().nullable().describe("Event time in HH:MM format, or null if not found"),
  venue: z.string().nullable().describe("Venue or location name, or null if not found"),
  description: z
    .string()
    .nullable()
    .describe("Brief description of the event in Spanish, max 200 chars"),
  category: z
    .string()
    .nullable()
    .describe(
      "Event category: one of 'musica', 'exposicion', 'cine', 'teatro', 'charla', 'fiesta', 'otro'"
    ),
  url: z.string().nullable().describe("URL related to the event, or null if not found"),
});

const eventsOutputSchema = z.object({
  events: z.array(eventSchema).describe("Array of extracted events. Can be 1 or more."),
  summary: z
    .string()
    .describe("Brief summary of what was extracted, in Spanish"),
});

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let emailContent = "";
    let subject = "";
    let fromEmail = "";

    // Handle both SendGrid Inbound Parse (multipart/form-data) and JSON (test mode)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      // SendGrid sends: text, html, subject, from, to, envelope, etc.
      const textBody = (formData.get("text") as string) || "";
      const htmlBody = (formData.get("html") as string) || "";
      // Prefer plain text, fall back to HTML
      emailContent = textBody || htmlBody.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      subject = (formData.get("subject") as string) || "";
      fromEmail = (formData.get("from") as string) || "";

      // Log for debugging (remove after testing)
      console.log("[v0] SendGrid inbound received:", {
        from: fromEmail,
        subject,
        textLength: textBody.length,
        htmlLength: htmlBody.length,
      });
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

    // Use AI SDK 6 with structured output to extract event data
    const { output } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      output: Output.object({ schema: eventsOutputSchema }),
      prompt: `You are an expert event data extractor for a cultural events agenda in Madrid, Spain.

Analyze the following email/text and extract ALL cultural events mentioned. For each event, extract:
- title: The name of the event
- date: In YYYY-MM-DD format (if only day/month given, assume year 2026)
- time: In HH:MM format if available
- venue: The location/venue name
- description: A brief description in Spanish (max 200 chars)
- category: One of: musica, exposicion, cine, teatro, charla, fiesta, otro
- url: Any URL mentioned for the event

If the subject line provides context, use it.

Subject: ${subject}
From: ${fromEmail}

Email content:
${emailContent}`,
    });

    if (!output || !output.events || output.events.length === 0) {
      return NextResponse.json(
        {
          error: "No events could be extracted from the content",
          summary: output?.summary || "No se pudieron extraer eventos del contenido.",
        },
        { status: 422 }
      );
    }

    // Store extracted events in Supabase
    const supabase = await createClient();
    const storedEvents = [];

    for (const event of output.events) {
      const eventData = {
        id: crypto.randomUUID(),
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        description: event.description,
        category: event.category,
        url: event.url,
        status: "interested" as const,
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
      summary: output.summary,
      eventsExtracted: output.events.length,
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

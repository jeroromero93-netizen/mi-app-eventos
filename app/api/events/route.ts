import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Error fetching events", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ events: data || [] });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Error fetching events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const eventData = {
      id: body.id || crypto.randomUUID(),
      title: body.title,
      date: body.date,
      time: body.time || null,
      venue: body.venue || null,
      description: body.description || null,
      category: body.category || null,
      url: body.url || null,
      status: body.status || "interested",
    };

    const { data, error } = await supabase
      .from("events")
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Error creating event", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ event: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Error creating event" },
      { status: 500 }
    );
  }
}

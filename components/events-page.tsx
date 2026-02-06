"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Plus } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { EmailInfoModal } from "@/components/email-info-modal";
import { EmptyState } from "@/components/empty-state";
import type { Event } from "@/lib/types";

type ViewFilter = "today" | "week" | "all";
type StatusFilter = "all" | "confirmed" | "interested";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => data.events || []);

export function EventsPage() {
  const {
    data: events = [],
    mutate,
    isLoading,
  } = useSWR<Event[]>("/api/events", fetcher);

  const [view, setView] = useState<ViewFilter>("all");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [showEmailInfo, setShowEmailInfo] = useState(false);

  const deleteEvent = useCallback(
    async (id: string) => {
      // Optimistic update
      mutate(
        events.filter((e) => e.id !== id),
        false
      );
      try {
        await fetch(`/api/events/${id}`, { method: "DELETE" });
        mutate();
      } catch (error) {
        console.error("Error deleting event:", error);
        mutate();
      }
    },
    [events, mutate]
  );

  const toggleStatus = useCallback(
    async (id: string) => {
      const event = events.find((e) => e.id === id);
      if (!event) return;
      const newStatus =
        event.status === "confirmed" ? "interested" : "confirmed";

      // Optimistic update
      mutate(
        events.map((e) => (e.id === id ? { ...e, status: newStatus } : e)),
        false
      );
      try {
        await fetch(`/api/events/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        mutate();
      } catch (error) {
        console.error("Error updating event:", error);
        mutate();
      }
    },
    [events, mutate]
  );

  const getFilteredEvents = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    let filtered = events;

    if (view === "today") {
      filtered = filtered.filter((e) => {
        const eventDate = new Date(e.date + "T00:00:00");
        return eventDate.toDateString() === today.toDateString();
      });
    } else if (view === "week") {
      filtered = filtered.filter((e) => {
        const eventDate = new Date(e.date + "T00:00:00");
        return eventDate >= today && eventDate < weekFromNow;
      });
    }

    if (filter !== "all") {
      filtered = filtered.filter((e) => e.status === filter);
    }

    return filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [events, view, filter]);

  const filteredEvents = getFilteredEvents();

  const viewOptions: { value: ViewFilter; label: string }[] = [
    { value: "today", label: "Hoy" },
    { value: "week", label: "Esta semana" },
    { value: "all", label: "Todos" },
  ];

  const filterOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "confirmed", label: "Confirmado" },
    { value: "interested", label: "Interesado" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-card-foreground">
              Agenda Cultural Madrid
            </h1>
            <button
              onClick={() => setShowEmailInfo(!showEmailInfo)}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted"
              aria-label="Agregar evento"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

          {/* View tabs */}
          <nav className="mb-3 flex gap-2" aria-label="Vista temporal">
            {viewOptions.map((v) => (
              <button
                key={v.value}
                onClick={() => setView(v.value)}
                className={`rounded-lg px-4 py-2 font-medium transition ${
                  view === v.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {v.label}
              </button>
            ))}
          </nav>

          {/* Filter tabs */}
          <div className="flex gap-2" role="group" aria-label="Filtro de estado">
            {filterOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filter === f.value
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Email info modal */}
      <EmailInfoModal
        open={showEmailInfo}
        onClose={() => setShowEmailInfo(false)}
      />

      {/* Events list */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            view={view}
            onAddEvent={() => setShowEmailInfo(true)}
          />
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onToggleStatus={toggleStatus}
                onDelete={deleteEvent}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { Check, Trash2, MapPin, ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoy";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Manana";
  } else {
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
}

const categoryColors: Record<string, string> = {
  musica: "bg-primary/10 text-primary",
  exposicion: "bg-amber-100 text-amber-800",
  cine: "bg-sky-100 text-sky-800",
  teatro: "bg-rose-100 text-rose-800",
  charla: "bg-teal-100 text-teal-800",
  fiesta: "bg-fuchsia-100 text-fuchsia-800",
  otro: "bg-muted text-muted-foreground",
};

export function EventCard({ event, onToggleStatus, onDelete }: EventCardProps) {
  const catStyle =
    categoryColors[event.category || "otro"] || categoryColors.otro;

  return (
    <div className="rounded-xl bg-card p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-bold text-card-foreground">
            {event.title}
          </h3>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{formatDate(event.date)}</span>
            {event.time && <span>{"- " + event.time}</span>}
          </div>
          {event.venue && (
            <p className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {event.venue}
            </p>
          )}
          {event.description && (
            <p className="mb-2 text-sm text-card-foreground/80">
              {event.description}
            </p>
          )}
          {event.category && (
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${catStyle}`}
            >
              {event.category}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onToggleStatus(event.id)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
            event.status === "confirmed"
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {event.status === "confirmed" ? (
            <>
              <Check className="h-4 w-4" />
              Confirmado
            </>
          ) : (
            "Interesado"
          )}
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive transition hover:bg-destructive/20"
          aria-label={`Eliminar ${event.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Ver mas info
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

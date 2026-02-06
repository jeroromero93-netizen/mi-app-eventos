"use client";

import { Calendar } from "lucide-react";

interface EmptyStateProps {
  view: string;
  onAddEvent: () => void;
}

export function EmptyState({ view, onAddEvent }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
      <p className="text-muted-foreground">
        {view === "today"
          ? "No hay eventos para hoy"
          : view === "week"
            ? "No hay eventos esta semana"
            : "No hay eventos"}
      </p>
      <button
        onClick={onAddEvent}
        className="mt-4 rounded-lg bg-primary px-6 py-2 text-primary-foreground transition hover:bg-primary/90"
      >
        Agregar evento
      </button>
    </div>
  );
}

"use client";

import { X } from "lucide-react";

interface EmailInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export function EmailInfoModal({ open, onClose }: EmailInfoModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Informacion para agregar eventos por email"
    >
      <div
        className="w-full max-w-md rounded-xl bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-bold text-card-foreground">
            Agregar eventos por email
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-card-foreground">Envia emails a:</p>
          <div className="rounded-lg bg-primary/10 p-3">
            <code className="font-mono text-sm text-primary">
              eventos@tu-agenda-madrid.vercel.app
            </code>
          </div>
          <ul className="space-y-1 text-xs">
            <li>Screenshots de Instagram</li>
            <li>Reenvia newsletters</li>
            <li>Pega links de eventos</li>
            <li>Escribe info del evento</li>
          </ul>
          <p className="text-xs text-muted-foreground/70">
            La IA extraera automaticamente toda la informacion del evento.
          </p>
        </div>
      </div>
    </div>
  );
}

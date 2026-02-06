"use client";

import { X } from "lucide-react";
import Link from "next/link";

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
            Agregar eventos
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          {/* Test mode link */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="mb-2 font-semibold text-card-foreground">
              Probar extraccion con IA
            </p>
            <p className="mb-3 text-xs">
              Pega texto de un email, newsletter o mensaje y la IA extraera los
              eventos automaticamente.
            </p>
            <Link
              href="/test-email"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Probar ahora
            </Link>
          </div>

          {/* Email info */}
          <div>
            <p className="mb-2 font-medium text-card-foreground">
              O envia emails a:
            </p>
            <div className="rounded-lg bg-muted p-3">
              <code className="font-mono text-sm text-primary">
                eventos@tu-agenda-madrid.vercel.app
              </code>
            </div>
            <p className="mt-2 text-xs text-muted-foreground/70">
              (Requiere configurar SendGrid Inbound Parse)
            </p>
          </div>

          <ul className="space-y-1 text-xs">
            <li>{"- "}Screenshots de Instagram</li>
            <li>{"- "}Reenvia newsletters</li>
            <li>{"- "}Pega links de eventos</li>
            <li>{"- "}Escribe info del evento</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

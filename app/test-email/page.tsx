"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Clock,
  Tag,
} from "lucide-react";
import Link from "next/link";

interface ExtractedEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  venue: string | null;
  description: string | null;
  category: string | null;
  url: string | null;
  status: string;
}

interface ProcessResult {
  success?: boolean;
  error?: string;
  summary?: string;
  eventsExtracted?: number;
  eventsStored?: number;
  events?: ExtractedEvent[];
  details?: string;
}

const sampleEmails = [
  {
    label: "Newsletter ejemplo",
    subject: "Eventos culturales Madrid - Febrero 2026",
    content: `Hola! Aqui tienes los mejores eventos de esta semana en Madrid:

1. CONCIERTO: Rosalia en el WiZink Center
   Fecha: 15 de febrero de 2026, 21:00h
   Lugar: WiZink Center, Madrid
   Entradas: https://wizinkcenter.es/rosalia
   Un show impresionante con su nueva gira mundial.

2. EXPOSICION: Picasso y el Guernica - Una mirada renovada
   Del 10 al 28 de febrero de 2026
   Horario: 10:00 - 20:00
   Museo Reina Sofia
   Entrada gratuita
   https://museoreinasofia.es/exposiciones/picasso

3. TEATRO: La Casa de Bernarda Alba
   Sabado 20 de febrero, 19:30h
   Teatro Espanol
   Direccion de Miguel del Arco
   Entradas desde 15 euros
   https://teatroespanol.es/bernarda-alba`,
  },
  {
    label: "Mensaje de amigo",
    subject: "Plan para el finde!",
    content: `Ey! He visto que este viernes 13 de febrero hay un festival de jazz increible en Cafe Central a las 22:00. Tocan varios grupos internacionales. Y el sabado 14 de febrero por la tarde hay mercadillo vintage en Matadero Madrid desde las 11:00 hasta las 20:00. Vamos?`,
  },
  {
    label: "Instagram/Screenshot texto",
    subject: "",
    content: `CINE AL AIRE LIBRE EN LA CASA DE CAMPO
Ciclo de cine clasico espanol
Todos los viernes de febrero a las 20:30
Entrada libre hasta completar aforo
Proxima pelicula: "El espiritu de la colmena" de Victor Erice
Viernes 14 de febrero
Mas info: @cineairelibre_madrid`,
  },
];

export default function TestEmailPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await fetch("/api/process-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error:
          error instanceof Error
            ? error.message
            : "Error al procesar el contenido",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSample = (sample: (typeof sampleEmails)[0]) => {
    setSubject(sample.subject);
    setContent(sample.content);
    setResult(null);
  };

  const categoryLabels: Record<string, string> = {
    musica: "Musica",
    exposicion: "Exposicion",
    cine: "Cine",
    teatro: "Teatro",
    charla: "Charla",
    fiesta: "Fiesta",
    otro: "Otro",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <Link
            href="/"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Volver a la agenda"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-card-foreground">
              Test: Procesar Email
            </h1>
            <p className="text-sm text-muted-foreground">
              Pega texto de un email, newsletter o screenshot para extraer
              eventos
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Sample emails */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Ejemplos rapidos
          </h2>
          <div className="flex flex-wrap gap-2">
            {sampleEmails.map((sample, i) => (
              <button
                key={i}
                onClick={() => loadSample(sample)}
                className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/20"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </section>

        {/* Input form */}
        <section className="mb-6 rounded-xl bg-card p-4 shadow-sm">
          <div className="mb-4">
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm font-medium text-card-foreground"
            >
              Asunto (opcional)
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: Eventos esta semana en Madrid"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="mb-1.5 block text-sm font-medium text-card-foreground"
            >
              Contenido del email / texto
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Pega aqui el contenido del email, newsletter, mensaje de WhatsApp, texto de un screenshot de Instagram..."
              className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing || !content.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analizando con IA...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Procesar y extraer eventos
              </>
            )}
          </button>
        </section>

        {/* Results */}
        {result && (
          <section className="space-y-4">
            {/* Status banner */}
            {result.success ? (
              <div className="flex items-start gap-3 rounded-xl bg-success/10 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <div>
                  <p className="font-semibold text-success">
                    {result.eventsExtracted}{" "}
                    {result.eventsExtracted === 1
                      ? "evento extraido"
                      : "eventos extraidos"}{" "}
                    y {result.eventsStored} guardado
                    {result.eventsStored !== 1 ? "s" : ""}
                  </p>
                  {result.summary && (
                    <p className="mt-1 text-sm text-foreground/80">
                      {result.summary}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl bg-destructive/10 p-4">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">
                    Error al procesar
                  </p>
                  <p className="mt-1 text-sm text-foreground/80">
                    {result.error}
                  </p>
                  {result.details && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {result.details}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Extracted events */}
            {result.events && result.events.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Eventos guardados en tu agenda
                </h3>
                {result.events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl bg-card p-4 shadow-sm"
                  >
                    <h4 className="mb-2 text-lg font-bold text-card-foreground">
                      {event.title}
                    </h4>
                    <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.date}
                      </span>
                      {event.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {event.time}
                        </span>
                      )}
                      {event.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.venue}
                        </span>
                      )}
                      {event.category && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {categoryLabels[event.category] || event.category}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-card-foreground/80">
                        {event.description}
                      </p>
                    )}
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-primary hover:underline"
                      >
                        {event.url}
                      </a>
                    )}
                  </div>
                ))}

                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Ver mi agenda completa
                </Link>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

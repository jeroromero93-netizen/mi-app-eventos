# Ejemplos de Emails para Probar

Aquí tienes varios ejemplos de emails que puedes enviar a tu dirección configurada para probar la extracción automática de eventos.

## Ejemplo 1: Email simple con info básica

```
Asunto: Concierto de jazz

Vi este concierto que me interesa:

Concierto de Jazz en Café Central
Viernes 14 de febrero a las 21:00
Plaza del Ángel, 10, Madrid

Entrada: 15€
```

**Resultado esperado:**
- Título: Concierto de Jazz en Café Central
- Fecha: 2026-02-14
- Hora: 21:00
- Lugar: Plaza del Ángel, 10, Madrid
- Categoría: música

---

## Ejemplo 2: Newsletter de Time Out

```
Asunto: Fwd: Lo mejor del fin de semana en Madrid

---------- Forwarded message ---------
From: Time Out Madrid <noreply@timeout.com>

LO MEJOR DEL FIN DE SEMANA

TEATRO: "La Casa de Bernarda Alba"
Teatro Español
Sábado 15 de febrero, 20:00h
Precio: 25€

Una producción impecable del clásico de Lorca.

Más información: https://timeout.com/madrid/teatro/bernarda-alba
```

**Resultado esperado:**
- Título: La Casa de Bernarda Alba
- Fecha: 2026-02-15
- Hora: 20:00
- Lugar: Teatro Español
- Categoría: teatro
- URL: https://timeout.com/madrid/teatro/bernarda-alba

---

## Ejemplo 3: Link directo

```
Asunto: Evento interesante

https://www.mataderomadrid.org/programacion/exposicion-arte-urbano

Quiero ir a esta exposición
```

**Resultado esperado:**
Claude accederá al link y extraerá la información del evento.

---

## Ejemplo 4: Texto informal de WhatsApp copiado

```
Asunto: Fiesta en Sala But

Oye te acuerdas que te dije de la fiesta?

Es el viernes que viene (21 de feb) en Sala But, en Barceló
Creo que empieza a las 23h o 00h

Tocán unos DJs muy buenos
Entrada 12€ con copa

https://salabutmadrid.com/eventos
```

**Resultado esperado:**
- Título: Fiesta en Sala But
- Fecha: 2026-02-21
- Hora: 23:00
- Lugar: Sala But, Barceló
- Categoría: fiesta
- Descripción: DJs en vivo
- URL: https://salabutmadrid.com/eventos

---

## Ejemplo 5: Email con múltiples eventos

```
Asunto: Planes para febrero

Hola! Mira estos planes que vi:

1. Mercadillo de El Rastro
   Domingo 16 de febrero
   De 9:00 a 15:00
   La Latina

2. Charla sobre IA en Impact Hub
   Martes 18 de febrero, 19:30
   Calle Alameda
   Entrada gratuita
```

**Resultado esperado:**
Claude debería extraer el primer evento (El Rastro) o el más relevante.

---

## Ejemplo 6: Screenshot de Instagram

Para probar con screenshots:

1. Haz screenshot de una historia de Instagram que anuncie un evento
2. Adjunta la imagen a un email
3. Asunto: "Evento de Instagram"
4. Envía

Claude debería ser capaz de leer el texto de la imagen y extraer:
- Título del evento
- Fecha y hora
- Lugar
- Descripción

---

## Ejemplo 7: Formato de cartelera de cine

```
Asunto: Cine este finde

CINETECA MADRID
Calle Santa Isabel, 3

BLADE RUNNER 2049
Sábado 22 febrero, 18:00 y 21:30
Versión original subtitulada

Entradas: 4€

www.cinetecamadrid.com
```

**Resultado esperado:**
- Título: Blade Runner 2049
- Fecha: 2026-02-22
- Hora: 18:00
- Lugar: Cineteca Madrid, Calle Santa Isabel, 3
- Categoría: cine
- Descripción: Versión original subtitulada

---

## Ejemplo 8: Evento recurrente

```
Asunto: Yoga en el parque

YOGA AL AIRE LIBRE

Todos los domingos de febrero
10:00 - 11:30
Parque del Retiro (zona del lago)

Gratuito, solo hay que llevar esterilla

Próxima sesión: 23 de febrero
```

**Resultado esperado:**
- Título: Yoga al aire libre
- Fecha: 2026-02-23
- Hora: 10:00
- Lugar: Parque del Retiro
- Categoría: otro
- Descripción: Sesión gratuita, llevar esterilla

---

## Consejos para mejores resultados

1. **Incluye siempre la fecha** (día/mes o día de la semana)
2. **Especifica la hora** si la sabes
3. **Menciona el lugar** con nombre del sitio
4. **Añade links** cuando los tengas
5. **Categoría** ayuda pero Claude suele detectarla bien

## Qué puede fallar

- Fechas ambiguas ("el próximo viernes" sin contexto)
- Eventos muy antiguos o futuros sin año
- Múltiples eventos en un mismo email
- Imágenes de muy baja calidad

Claude es bastante inteligente y puede manejar formatos informales, abreviaciones y errores tipográficos.

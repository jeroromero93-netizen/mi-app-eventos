import Anthropic from '@anthropic-ai/sdk';

// This endpoint receives emails from SendGrid Inbound Parse
// Configure SendGrid to POST to: https://your-app.vercel.app/api/process-email

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, html, subject, from, attachments } = req.body;
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Prepare content for Claude
    let emailContent = '';
    if (html) {
      // Strip HTML tags for cleaner processing
      emailContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    } else if (text) {
      emailContent = text;
    }

    // Handle attachments (screenshots from Instagram, etc.)
    let imageData = null;
    if (attachments && attachments.length > 0) {
      // Get first image attachment
      const imageAttachment = attachments.find(att => 
        att.type?.startsWith('image/')
      );
      if (imageAttachment && imageAttachment.content) {
        imageData = {
          type: 'image',
          source: {
            type: 'base64',
            media_type: imageAttachment.type,
            data: imageAttachment.content
          }
        };
      }
    }

    // Create prompt for Claude to extract event info
    const prompt = `Eres un asistente que extrae información de eventos culturales en Madrid de emails, screenshots y textos.

Analiza el siguiente contenido y extrae la información del evento en formato JSON.

Contenido del email:
Asunto: ${subject || 'Sin asunto'}
De: ${from || 'Desconocido'}
Contenido: ${emailContent}

Extrae y devuelve SOLO un objeto JSON con esta estructura (sin texto adicional):
{
  "title": "Título del evento",
  "date": "YYYY-MM-DD",
  "time": "HH:MM" o null si no está especificado,
  "venue": "Nombre del lugar",
  "description": "Descripción breve",
  "category": "cine|teatro|música|charla|fiesta|exposición|otro",
  "url": "URL del evento si existe" o null,
  "status": "interested"
}

Si no encuentras algún dato, usa null. La fecha debe estar en formato ISO (YYYY-MM-DD).
Si el contenido menciona múltiples eventos, devuelve solo el más relevante o el primero.

Responde SOLO con el JSON, nada más.`;

    // Call Claude API
    const messageContent = imageData 
      ? [imageData, { type: 'text', text: prompt }]
      : prompt;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: messageContent
      }]
    });

    // Extract JSON from Claude's response
    const responseText = message.content[0].text;
    let eventData;
    
    try {
      // Try to parse the response as JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        eventData = JSON.parse(jsonMatch[0]);
      } else {
        eventData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return res.status(400).json({ 
        error: 'Could not extract event data',
        claudeResponse: responseText 
      });
    }

    // Add timestamp and ID
    eventData.id = Date.now().toString();
    eventData.createdAt = new Date().toISOString();

    // Store event (for now, we'll use Vercel KV or a simple approach)
    // You'll need to set up Vercel Postgres or KV storage
    await storeEvent(eventData);

    return res.status(200).json({ 
      success: true, 
      event: eventData,
      message: 'Evento añadido correctamente'
    });

  } catch (error) {
    console.error('Error processing email:', error);
    return res.status(500).json({ 
      error: 'Error processing email',
      details: error.message 
    });
  }
}

// Temporary storage function - replace with actual database
async function storeEvent(event) {
  // For MVP, you can use Vercel KV, Vercel Postgres, or even a simple file
  // Here's a placeholder that you'll need to implement based on your choice
  
  // Option 1: Vercel Postgres (recommended)
  // const { sql } = await import('@vercel/postgres');
  // await sql`INSERT INTO events (id, title, date, time, venue, description, category, url, status, created_at)
  //           VALUES (${event.id}, ${event.title}, ${event.date}, ${event.time}, ${event.venue}, 
  //                   ${event.description}, ${event.category}, ${event.url}, ${event.status}, ${event.createdAt})`;
  
  // Option 2: Vercel KV (simpler for MVP)
  // const { kv } = await import('@vercel/kv');
  // await kv.set(`event:${event.id}`, JSON.stringify(event));
  // await kv.sadd('events:all', event.id);
  
  console.log('Event to store:', event);
  return event;
}

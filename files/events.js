// API endpoint to get all events
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch events from storage
    const events = await getEvents();
    
    return res.status(200).json({ 
      events: events || [],
      count: events?.length || 0
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ 
      error: 'Error fetching events',
      details: error.message 
    });
  }
}

// Fetch events from storage
async function getEvents() {
  // Replace with actual database query
  
  // Option 1: Vercel Postgres
  // const { sql } = await import('@vercel/postgres');
  // const result = await sql`SELECT * FROM events ORDER BY date ASC`;
  // return result.rows;
  
  // Option 2: Vercel KV
  // const { kv } = await import('@vercel/kv');
  // const eventIds = await kv.smembers('events:all');
  // const events = await Promise.all(
  //   eventIds.map(async (id) => {
  //     const eventJson = await kv.get(`event:${id}`);
  //     return JSON.parse(eventJson);
  //   })
  // );
  // return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // For now, return mock data for testing
  return [
    {
      id: '1',
      title: 'Jazz en Café Central',
      date: '2026-02-07',
      time: '21:00',
      venue: 'Café Central',
      description: 'Concierto de jazz en vivo',
      category: 'música',
      url: null,
      status: 'interested',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Exposición Thyssen',
      date: '2026-02-08',
      time: '10:00',
      venue: 'Museo Thyssen',
      description: 'Nueva exposición de arte contemporáneo',
      category: 'exposición',
      url: 'https://museothyssen.org',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  ];
}

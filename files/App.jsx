import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Bell, Filter, Trash2, Check, X } from 'lucide-react';

function App() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('today'); // 'today', 'week', 'all'
  const [filter, setFilter] = useState('all'); // 'all', 'confirmed', 'interested'
  const [showEmailInfo, setShowEmailInfo] = useState(false);

  // Load events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error loading events:', error);
      // Load from localStorage as fallback
      const stored = localStorage.getItem('events');
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const toggleStatus = async (id) => {
    const event = events.find(e => e.id === id);
    const newStatus = event.status === 'confirmed' ? 'interested' : 'confirmed';
    
    try {
      await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      setEvents(events.map(e => 
        e.id === id ? { ...e, status: newStatus } : e
      ));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Filter events based on view and filter
  const getFilteredEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    let filtered = events;

    // Filter by view
    if (view === 'today') {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.toDateString() === today.toDateString();
      });
    } else if (view === 'week') {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate < weekFromNow;
      });
    }

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(e => e.status === filter);
    }

    // Sort by date
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Agenda Cultural Madrid
            </h1>
            <button
              onClick={() => setShowEmailInfo(!showEmailInfo)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* View tabs */}
          <div className="flex gap-2 mb-3">
            {['today', 'week', 'all'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  view === v
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {v === 'today' ? 'Hoy' : v === 'week' ? 'Esta semana' : 'Todos'}
              </button>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Todos' },
              { value: 'confirmed', label: 'Confirmado' },
              { value: 'interested', label: 'Interesado' }
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === f.value
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email info popup */}
      {showEmailInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Añadir eventos por email</h3>
              <button
                onClick={() => setShowEmailInfo(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="font-medium">Envía emails a:</p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <code className="text-purple-700 font-mono">
                  eventos@tu-agenda-madrid.vercel.app
                </code>
              </div>
              <p className="text-xs text-gray-600">
                📸 Screenshots de Instagram<br />
                📧 Reenvía newsletters<br />
                🔗 Pega links de eventos<br />
                ✍️ Escribe info del evento
              </p>
              <p className="text-xs text-gray-500">
                La IA extraerá automáticamente toda la información del evento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {view === 'today' 
                ? 'No hay eventos para hoy' 
                : 'No hay eventos'}
            </p>
            <button
              onClick={() => setShowEmailInfo(true)}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Añadir evento
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="font-medium">{formatDate(event.date)}</span>
                      {event.time && <span>• {event.time}</span>}
                    </div>
                    {event.venue && (
                      <p className="text-sm text-gray-600 mb-2">📍 {event.venue}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                    )}
                    {event.category && (
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {event.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleStatus(event.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      event.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {event.status === 'confirmed' ? (
                      <>
                        <Check className="w-4 h-4 inline mr-1" />
                        Confirmado
                      </>
                    ) : (
                      '⭐ Interesado'
                    )}
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-sm text-purple-600 hover:underline"
                  >
                    Ver más info →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

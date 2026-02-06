-- Agenda Cultural Madrid - Database Schema

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  venue TEXT,
  description TEXT,
  category TEXT,
  url TEXT,
  status TEXT DEFAULT 'interested',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster date queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO events (id, title, date, time, venue, description, category, url, status)
VALUES 
  ('sample-1', 'Jazz en Café Central', '2026-02-08', '21:00', 'Café Central', 'Concierto de jazz en vivo con músicos locales', 'música', 'https://cafecentralmadrid.com', 'interested'),
  ('sample-2', 'Exposición Thyssen', '2026-02-10', '10:00', 'Museo Thyssen', 'Nueva exposición de arte contemporáneo', 'exposición', 'https://museothyssen.org', 'confirmed'),
  ('sample-3', 'Cine de Terror en Cineteca', '2026-02-12', '20:30', 'Cineteca Madrid', 'Ciclo de cine de terror clásico', 'cine', null, 'interested')
ON CONFLICT (id) DO NOTHING;

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
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
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for now since this is a personal app without auth
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to events" ON events FOR ALL USING (true) WITH CHECK (true);

-- Sample data for testing
INSERT INTO events (id, title, date, time, venue, description, category, url, status)
VALUES 
  ('sample-1', 'Jazz en Cafe Central', '2026-02-08', '21:00', 'Cafe Central', 'Concierto de jazz en vivo con musicos locales', 'musica', 'https://cafecentralmadrid.com', 'interested'),
  ('sample-2', 'Exposicion Thyssen', '2026-02-10', '10:00', 'Museo Thyssen', 'Nueva exposicion de arte contemporaneo', 'exposicion', 'https://museothyssen.org', 'confirmed'),
  ('sample-3', 'Cine de Terror en Cineteca', '2026-02-12', '20:30', 'Cineteca Madrid', 'Ciclo de cine de terror clasico', 'cine', null, 'interested')
ON CONFLICT (id) DO NOTHING;

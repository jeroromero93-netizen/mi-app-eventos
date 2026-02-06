export interface Event {
  id: string;
  title: string;
  date: string;
  time: string | null;
  venue: string | null;
  description: string | null;
  category: string | null;
  url: string | null;
  status: "interested" | "confirmed";
  created_at: string;
  updated_at: string;
}

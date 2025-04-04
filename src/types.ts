export type TimelineItem = {
  id: number;
  start: string;
  end: string;
  name: string;
  lane?: number;
  category?: string; // Optional category for color coding
}; 
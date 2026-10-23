export interface PillarItem {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  image: string;
  description: string;
  fullText?: string[];
}

export interface WorkshopItem {
  id: string;
  slug: string;
  title: string;
  tag: string;
  subtitle: string;
  description: string;
  image: string;
  fullDescription: string[];
  features?: string[];
  targetAudience?: string;
  datesAndLocation?: {
    dates?: string;
    schedule?: string;
    location?: string;
    price?: string;
    note?: string;
  };
  seasons?: {
    name: string;
    date: string;
    description: string;
    image: string;
  }[];
  whatToBring?: string[];
  hosts?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  category: string;
}

export interface UpcomingDateItem {
  text: string;
  url?: string;
  workshopId?: string;
}

export interface ModalState {
  isOpen: boolean;
  tag?: string;
  title: string;
  content: string | React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

import type { JournalEditionSlug } from '@/lib/journal-editions';

export type Story = {
  opening: string;
  takeaway: string;
  sections: {
    id: string;
    heading: string;
    paragraphs: string[];
    list?: string[];
    table?: {caption: string; columns: string[]; rows: string[][]};
  }[];
  evidence: string;
  sources: {label: string; href: string; note: string}[];
  related: {label: string; slug: JournalEditionSlug | 'elite-running-training' | 'heart-rate-zones-running' | 'vo2max-and-5000m' | '5k-pace-1524' | '400-vs-1000-intervals'}[];
};

export type Source = [title: string, url: string, note: string];

export type Athlete = {
  id: string;
  name: string;
  era: string;
  result: string;
  hook: string;
  physical: string;
  technical: string;
  tactical: string;
  mental: string;
  integrated: string;
  phases: [phase: string, evidence: string][];
  limit: string;
  lesson: string;
};

export type Dossier = {
  distance: string;
  title: string;
  description: string;
  opening: string;
  physiology: string[];
  athletes: [Athlete, Athlete, Athlete, Athlete];
  comparison: [athlete: string, priority: string, evidence: string, constraint: string][];
  practice: string[];
  sources: Source[];
  related: [slug: string, title: string];
};

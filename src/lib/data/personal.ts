export interface HabitFeature {
  label: string;
  done: boolean;
}

export const HABIT_TRACKER = {
  name: 'HabitTracker',
  description:
    'Sistema personal unificado de seguimiento de hábitos, finanzas y rutinas. Un espacio para construir consistencia y medir progreso de forma honesta.',
  status: 'design' as const,
  features: [
    { label: 'Organización de finanzas personales', done: false },
    { label: 'Horarios y rutinas diarias', done: false },
    { label: 'Seguimiento de hábitos con racha', done: false },
    { label: 'Metas y objetivos personales', done: false },
  ] satisfies HabitFeature[],
  stack: [
    'Next.js + TypeScript',
    'MongoDB',
    'Tailwind + shadcn/ui',
    'Charts para progreso',
  ],
};

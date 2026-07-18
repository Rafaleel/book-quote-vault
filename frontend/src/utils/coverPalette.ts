export interface CoverPalette {
  bg: string;
  border: string;
  text: string;
  sub: string;
  icon: string;
  badge: string;
}

export const COVER_PALETTES: CoverPalette[] = [
  { 
    bg: 'bg-indigo-50 dark:bg-indigo-950/20', 
    border: 'border-indigo-100 dark:border-indigo-900/30', 
    text: 'text-indigo-800 dark:text-indigo-300', 
    sub: 'text-indigo-400 dark:text-indigo-500', 
    icon: 'text-indigo-300 dark:text-indigo-600', 
    badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' 
  },
  { 
    bg: 'bg-amber-50 dark:bg-amber-950/20', 
    border: 'border-amber-100 dark:border-amber-900/30', 
    text: 'text-amber-800 dark:text-amber-300', 
    sub: 'text-amber-400 dark:text-amber-500', 
    icon: 'text-amber-300 dark:text-amber-600', 
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300' 
  },
  { 
    bg: 'bg-emerald-50 dark:bg-emerald-950/20', 
    border: 'border-emerald-100 dark:border-emerald-900/30', 
    text: 'text-emerald-800 dark:text-emerald-300', 
    sub: 'text-emerald-400 dark:text-emerald-500', 
    icon: 'text-emerald-300 dark:text-emerald-600', 
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-indigo-300' 
  },
  { 
    bg: 'bg-rose-50 dark:bg-rose-950/20', 
    border: 'border-rose-100 dark:border-rose-900/30', 
    text: 'text-rose-800 dark:text-rose-300', 
    sub: 'text-rose-400 dark:text-rose-500', 
    icon: 'text-rose-300 dark:text-rose-600', 
    badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300' 
  },
  { 
    bg: 'bg-sky-50 dark:bg-sky-950/20', 
    border: 'border-sky-100 dark:border-sky-900/30', 
    text: 'text-sky-800 dark:text-sky-300', 
    sub: 'text-sky-400 dark:text-sky-500', 
    icon: 'text-sky-300 dark:text-sky-600', 
    badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300' 
  },
  { 
    bg: 'bg-violet-50 dark:bg-violet-950/20', 
    border: 'border-violet-100 dark:border-violet-900/30', 
    text: 'text-violet-800 dark:text-violet-300', 
    sub: 'text-violet-400 dark:text-violet-500', 
    icon: 'text-violet-300 dark:text-violet-600', 
    badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300' 
  },
];

export const getPalette = (title: string): CoverPalette => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return COVER_PALETTES[Math.abs(hash) % COVER_PALETTES.length];
};

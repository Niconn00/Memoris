export const moods = [
  { value: 'felice', label: 'Felice', color: 'bg-green-200 dark:bg-green-800', textColor: 'text-green-800 dark:text-green-100', dot: 'bg-green-500' },
  { value: 'calmo', label: 'Calmo', color: 'bg-sky-200 dark:bg-sky-800', textColor: 'text-sky-800 dark:text-sky-100', dot: 'bg-sky-500' },
  { value: 'triste', label: 'Triste', color: 'bg-blue-200 dark:bg-blue-800', textColor: 'text-blue-800 dark:text-blue-100', dot: 'bg-blue-500' },
  { value: 'arrabbiato', label: 'Arrabbiato', color: 'bg-red-300 dark:bg-red-800', textColor: 'text-red-900 dark:text-red-100', dot: 'bg-red-500' },
  { value: 'sorpreso', label: 'Sorpreso', color: 'bg-yellow-200 dark:bg-yellow-700', textColor: 'text-yellow-800 dark:text-yellow-100', dot: 'bg-yellow-500' },
  { value: 'stanco', label: 'Stanco', color: 'bg-gray-300 dark:bg-gray-700', textColor: 'text-gray-800 dark:text-gray-100', dot: 'bg-gray-500' },
  { value: 'energico', label: 'Energico', color: 'bg-orange-300 dark:bg-orange-700', textColor: 'text-orange-900 dark:text-orange-100', dot: 'bg-orange-500' },
  { value: 'innamorato', label: 'Innamorato', color: 'bg-pink-200 dark:bg-pink-800', textColor: 'text-pink-800 dark:text-pink-100', dot: 'bg-pink-500' },
  { value: 'pensieroso', label: 'Pensieroso', color: 'bg-purple-200 dark:bg-purple-800', textColor: 'text-purple-800 dark:text-purple-100', dot: 'bg-purple-500' },
] as const;

export type MoodValue = typeof moods[number]['value'];

export const getMoodByValue = (value: string | undefined) => {
  if (!value) return undefined;
  return moods.find(m => m.value === value);
}

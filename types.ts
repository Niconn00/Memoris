export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  thoughts: string;
}

export interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  updateEntry: (id: string, updatedData: { mood: string; thoughts: string }) => void;
  deleteEntry: (id: string) => void;
}

export interface Reminder {
    id: string;
    time: string; // ISO string
    message: string;
}

export interface RemindersContextType {
    reminders: Reminder[];
    addReminder: (reminder: Omit<Reminder, 'id'>) => void;
    updateReminder: (id: string, updatedData: { message: string, time: string }) => void;
    deleteReminder: (id: string) => void;
}
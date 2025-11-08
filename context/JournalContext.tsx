import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { JournalEntry, JournalContextType } from '../types';

export const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const localData = localStorage.getItem('journalEntries');
      // Entries are sorted from newest to oldest
      return localData ? JSON.parse(localData).sort((a: JournalEntry, b: JournalEntry) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
    } catch (error) {
      console.error("Could not parse journal entries from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('journalEntries', JSON.stringify(entries));
    } catch (error) {
      console.error("Could not save journal entries to localStorage", error);
    }
  }, [entries]);

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: new Date().toISOString(),
      date: new Date().toISOString(), // Store date as ISO string
    };
    // Add new entry and re-sort
    setEntries(prevEntries => [newEntry, ...prevEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateEntry = (id: string, updatedData: { mood: string; thoughts: string }) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, ...updatedData } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
      {children}
    </JournalContext.Provider>
  );
};
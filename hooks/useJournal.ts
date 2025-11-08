
import { useContext } from 'react';
import { JournalContext } from '../context/JournalContext';
import { JournalContextType } from '../types';

export const useJournal = (): JournalContextType => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
   
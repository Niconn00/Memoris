import { useContext } from 'react';
import { RemindersContext } from '../context/RemindersContext';
import { RemindersContextType } from '../types';

export const useReminders = (): RemindersContextType => {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};
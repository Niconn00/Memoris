import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Reminder, RemindersContextType } from '../types';

export const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const RemindersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reminders, setReminders] = useState<Reminder[]>(() => {
        try {
            const localData = localStorage.getItem('reminders');
            return localData ? JSON.parse(localData).sort((a: Reminder, b: Reminder) => new Date(a.time).getTime() - new Date(b.time).getTime()) : [];
        } catch (error) {
            console.error("Could not parse reminders from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('reminders', JSON.stringify(reminders));
        } catch (error) {
            console.error("Could not save reminders to localStorage", error);
        }
    }, [reminders]);


    const addReminder = (reminder: Omit<Reminder, 'id'>) => {
        const newReminder: Reminder = {
            ...reminder,
            id: new Date().toISOString(),
        };
        setReminders(prev => [...prev, newReminder].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()));
    };

    const updateReminder = (id: string, updatedData: { message: string, time: string }) => {
        setReminders(prev => prev.map(r => (r.id === id ? { ...r, ...updatedData } : r))
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        );
    };

    const deleteReminder = (id: string) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    return (
        <RemindersContext.Provider value={{ reminders, addReminder, updateReminder, deleteReminder }}>
            {children}
        </RemindersContext.Provider>
    );
};
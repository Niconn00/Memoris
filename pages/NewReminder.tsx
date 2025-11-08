import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReminders } from '../hooks/useReminders';


const NewReminder: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);
    
    const { reminders, addReminder, updateReminder } = useReminders();
    const navigate = useNavigate();
    
    const [message, setMessage] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');

    const formatToDateTimeLocal = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        // Correct for timezone offset to display local time in input
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
        return localISOTime;
    };

    useEffect(() => {
        if (isEditing && id) {
            const reminderToEdit = reminders.find(r => r.id === id);
            if (reminderToEdit) {
                setMessage(reminderToEdit.message);
                setTime(formatToDateTimeLocal(reminderToEdit.time));
            } else {
                navigate('/reminders');
            }
        }
    }, [id, isEditing, reminders, navigate]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error on new submission
        if (!message || !time) return;

        const reminderTime = new Date(time);
        
        if (!isEditing && reminderTime <= new Date()) {
            setError("Per favore, seleziona un orario futuro.");
            return;
        }

        const reminderData = { message, time: reminderTime.toISOString() };

        if (isEditing && id) {
            updateReminder(id, reminderData);
        } else {
            addReminder(reminderData);
        }
        navigate('/reminders');
    };
    
    const pageTitle = isEditing ? 'Modifica Promemoria' : 'Nuovo Promemoria';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-light-bg dark:bg-dark-bg z-10 flex flex-col p-4"
        >
            <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-lg flex-grow flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                    <button
                        onClick={() => navigate('/reminders')}
                        className="text-accent font-bold px-3 py-1 rounded-md hover:bg-accent/10 transition-colors"
                    >
                        Annulla
                    </button>
                    <h2 className="font-bold text-lg text-light-text dark:text-dark-text">{pageTitle}</h2>
                    <button
                        form="reminder-form"
                        type="submit"
                        className="bg-accent text-white font-bold px-5 py-1.5 rounded-full shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!message || !time}
                    >
                        {isEditing ? 'Aggiorna' : 'Salva'}
                    </button>
                </header>

                <main className="flex-grow p-6 overflow-y-auto flex flex-col justify-center items-center">
                    <form id="reminder-form" onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
                            <h3 className="text-3xl font-bold text-center text-light-text dark:text-dark-text">
                                {isEditing ? 'Modifica il promemoria' : 'Cosa vuoi ricordare?'}
                        </h3>
                        <div>
                            <label htmlFor="message" className="block text-sm font-bold text-subtle-light dark:text-subtle-dark mb-2">Messaggio</label>
                            <input
                                id="message"
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Es. Meditare per 5 minuti"
                                className="w-full p-4 rounded-lg bg-paper dark:bg-dark-paper border border-border-light dark:border-border-dark focus:ring-2 focus:ring-accent focus:outline-none text-lg"
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-bold text-subtle-light dark:text-subtle-dark mb-2">Quando?</label>
                            <input
                                id="time"
                                type="datetime-local"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full p-4 rounded-lg bg-paper dark:bg-dark-paper border border-border-light dark:border-border-dark focus:ring-2 focus:ring-accent focus:outline-none text-lg"
                                required
                            />
                            {error && <p className="text-red-500 text-sm mt-2 font-semibold text-center">{error}</p>}
                        </div>
                    </form>
                </main>
            </div>
        </motion.div>
    );
};

export default NewReminder;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJournal } from '../hooks/useJournal';
import { useReminders } from '../hooks/useReminders';
import { JournalEntry, Reminder } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodByValue } from '../utils/moods';

// Simplified Entry Card for Dashboard
const DashboardEntryCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
    const moodDetails = getMoodByValue(entry.mood);
    const formatDateTime = (isoDate: string) => new Date(isoDate).toLocaleString('it-IT', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

    return (
        <Link to={`/edit/${entry.id}`} className="block bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${moodDetails?.dot || 'bg-gray-400'}`}></div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-light-text dark:text-dark-text truncate">{entry.thoughts.split('\n')[0] || 'Nessun titolo'}</p>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark">{formatDateTime(entry.date)}</p>
                </div>
            </div>
        </Link>
    );
};

// Simplified Reminder Card for Dashboard
const DashboardReminderCard: React.FC<{ reminder: Reminder }> = ({ reminder }) => {
    const formatTime = (isoDate: string) => new Date(isoDate).toLocaleString('it-IT', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
    
    return (
        <Link to={`/edit-reminder/${reminder.id}`} className="block bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full flex-shrink-0 bg-accent/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-light-text dark:text-dark-text truncate">{reminder.message}</p>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark">{formatTime(reminder.time)}</p>
                </div>
            </div>
        </Link>
    );
};

const Dashboard: React.FC = () => {
    const { entries } = useJournal();
    const { reminders } = useReminders();
    const [isAddMenuOpen, setAddMenuOpen] = useState(false);

    const recentEntries = entries.slice(0, 3);
    const upcomingReminders = reminders.filter(r => new Date(r.time) >= new Date()).slice(0, 3);

    return (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 py-8 pb-28"
        >
            <header className="mb-8 flex items-center justify-between gap-4">
                <h1 className="text-5xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">My diary</h1>
                <div className="flex items-center gap-2">
                    <Link 
                        to="/insights"
                        className="p-3 rounded-full text-subtle-light dark:text-subtle-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        aria-label="Visualizza statistiche"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z"/>
                        </svg>
                    </Link>
                </div>
            </header>

            <main className="space-y-8">
                {/* Recent Entries Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Ultime Voci</h2>
                        {entries.length > 3 && <Link to="/journal" className="text-accent font-bold hover:underline">Mostra tutto</Link>}
                    </div>
                    {recentEntries.length > 0 ? (
                        <div className="space-y-4">
                            {recentEntries.map(entry => <DashboardEntryCard key={entry.id} entry={entry} />)}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-light-card/50 dark:bg-dark-card/50 rounded-xl">
                            <p className="font-bold">Nessuna voce ancora</p>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1">Clicca il pulsante '+' per iniziare.</p>
                        </div>
                    )}
                </section>

                {/* Upcoming Reminders Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Prossimi Promemoria</h2>
                        {reminders.length > 3 && <Link to="/reminders" className="text-accent font-bold hover:underline">Mostra tutto</Link>}
                    </div>
                    {upcomingReminders.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingReminders.map(r => <DashboardReminderCard key={r.id} reminder={r} />)}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-light-card/50 dark:bg-dark-card/50 rounded-xl">
                            <p className="font-bold">Nessun promemoria</p>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1">Aggiungi un promemoria per non dimenticare.</p>
                        </div>
                    )}
                </section>
            </main>
            
            {/* FAB Button and Menu */}
            <button 
                onClick={() => setAddMenuOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-light-card dark:bg-dark-card rounded-full text-light-text dark:text-dark-text flex items-center justify-center shadow-lg hover:bg-yellow-300 dark:hover:bg-yellow-600 transform transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent/50 z-30"
                aria-label="Aggiungi una nuova voce o promemoria"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>

            <AnimatePresence>
                {isAddMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setAddMenuOpen(false)}
                            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-md z-40"
                        />
                        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
                            <motion.div 
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ ease: "circOut", duration: 0.2 }}
                                className="flex flex-col gap-4 mb-6"
                            >
                                <Link to="/new" onClick={() => setAddMenuOpen(false)} className="flex items-center gap-4 bg-light-card dark:bg-dark-card p-3 rounded-full shadow-lg hover:bg-yellow-300 dark:hover:bg-yellow-600 transition-colors">
                                    <span className="font-bold pr-2">Nuova Voce</span>
                                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="currentColor" viewBox="0 0 16 16"><path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/><path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1H2v1h-.5a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1H2v1h-.5a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1H2v1h-.5a.5.5 0 0 1 0-1H1z"/></svg>
                                    </div>
                                </Link>
                                <Link to="/new-reminder" onClick={() => setAddMenuOpen(false)} className="flex items-center gap-4 bg-light-card dark:bg-dark-card p-3 rounded-full shadow-lg hover:bg-yellow-300 dark:hover:bg-yellow-600 transition-colors">
                                    <span className="font-bold pr-2">Nuovo Promemoria</span>
                                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/></svg>
                                    </div>
                                </Link>
                            </motion.div>
                            <button 
                                onClick={() => setAddMenuOpen(false)}
                                className="w-16 h-16 bg-light-card dark:bg-dark-card rounded-full text-light-text dark:text-dark-text flex items-center justify-center shadow-lg hover:bg-yellow-300 dark:hover:bg-yellow-600 transform transition-all hover:scale-110 hover:rotate-45 focus:outline-none focus:ring-4 focus:ring-accent/50"
                                aria-label="Chiudi menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
                            </button>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
export default Dashboard;
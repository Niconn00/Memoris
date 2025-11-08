import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useReminders } from '../hooks/useReminders';
import { Reminder } from '../types';

const formatReminderTime = (isoDate: string) => {
    return new Date(isoDate).toLocaleString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const ReminderCard: React.FC<{ reminder: Reminder }> = ({ reminder }) => {
    const { deleteReminder } = useReminders();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [isConfirmingDelete, setConfirmingDelete] = React.useState(false);

    const toggleMenu = () => {
        if (menuOpen) {
            setConfirmingDelete(false);
        }
        setMenuOpen(!menuOpen);
    };

    const handleDelete = () => {
        if (isConfirmingDelete) {
            deleteReminder(reminder.id);
        } else {
            setConfirmingDelete(true);
        }
    };

    const handleEdit = () => {
        setMenuOpen(false);
        setConfirmingDelete(false);
        navigate(`/edit-reminder/${reminder.id}`);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
            className="bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm flex justify-between items-center gap-4"
        >
            <div className="flex-1 min-w-0">
                <p className="font-bold text-light-text dark:text-dark-text break-words">{reminder.message}</p>
                <p className="text-xs text-subtle-light dark:text-subtle-dark">{formatReminderTime(reminder.time)}</p>
            </div>
            <div className="relative flex-shrink-0">
                <button
                    onClick={toggleMenu}
                    className="p-2 rounded-full text-subtle-light dark:text-subtle-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    aria-label="Opzioni promemoria"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                  </svg>
                </button>
                <AnimatePresence>
                    {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-40 bg-light-card dark:bg-dark-card rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5"
                        onMouseLeave={() => { setMenuOpen(false); setConfirmingDelete(false); }}
                    >
                        <div className="py-1">
                          <button onClick={handleEdit} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/10">
                              Modifica
                          </button>
                          <button 
                              onClick={handleDelete} 
                              className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium transition-colors rounded-b-md ${
                                isConfirmingDelete
                                  ? 'bg-red-500 text-white hover:bg-red-600'
                                  : 'text-red-500 hover:bg-black/5 dark:hover:bg-white/10'
                              }`}
                          >
                              {isConfirmingDelete ? 'Conferma' : 'Elimina'}
                          </button>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const Reminders: React.FC = () => {
    const { reminders } = useReminders();
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto px-4 py-8"
        >
            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Promemoria</h1>
                <div className="flex items-center gap-2">
                    <Link to="/new-reminder" className="bg-accent text-white font-bold px-5 py-2 rounded-full shadow-sm hover:bg-accent-hover transition-colors">
                        Nuovo
                    </Link>
                    <Link to="/" className="text-accent font-bold px-4 py-2 rounded-md hover:bg-accent/10 transition-colors">
                        Indietro
                    </Link>
                </div>
            </header>
            
            <div className="mt-4">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Promemoria Attivi</h2>
                    {reminders.length > 0 ? (
                        <motion.div layout className="space-y-4">
                            <AnimatePresence>
                                {reminders.map(r => <ReminderCard key={r.id} reminder={r} />)}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <p className="text-center text-subtle-light dark:text-subtle-dark py-10">Nessun promemoria attivo.</p>
                    )}
                </div>
            </div>

        </motion.div>
    );
};

export default Reminders;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournal } from '../hooks/useJournal';
import { motion } from 'framer-motion';
import { moods } from '../utils/moods';


const NewEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { entries, addEntry, updateEntry } = useJournal();
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState<string>('');
  const [thoughts, setThoughts] = useState<string>('');
  const [entryDate, setEntryDate] = useState(new Date());

  useEffect(() => {
    if (isEditing && id) {
      const entryToEdit = entries.find(e => e.id === id);
      if (entryToEdit) {
        setSelectedMood(entryToEdit.mood);
        setThoughts(entryToEdit.thoughts);
        setEntryDate(new Date(entryToEdit.date));
      } else {
        // If entry not found, redirect to home
        navigate('/');
      }
    }
  }, [id, isEditing, entries, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || !thoughts) return;

    if (isEditing && id) {
      updateEntry(id, { mood: selectedMood, thoughts });
    } else {
      addEntry({ mood: selectedMood, thoughts });
    }
    navigate('/');
  };
  
  const pageTitle = isEditing ? 'Modifica Voce' : 'Nuova Voce';

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
                    onClick={() => navigate('/')}
                    className="text-accent font-bold px-3 py-1 rounded-md hover:bg-accent/10 transition-colors"
                >
                    Annulla
                </button>
                <h2 className="font-bold text-lg text-light-text dark:text-dark-text">{pageTitle}</h2>
                <button
                    onClick={handleSubmit}
                    className="bg-accent text-white font-bold px-5 py-1.5 rounded-full shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedMood || !thoughts}
                >
                    {isEditing ? 'Aggiorna' : 'Salva'}
                </button>
            </header>

            <main className="flex-grow p-6 overflow-y-auto flex flex-col">
                <h3 className="text-2xl font-bold text-center text-light-text dark:text-dark-text mb-6">
                    Come ti senti oggi?
                </h3>
                
                <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap mb-8">
                    {moods.map(mood => (
                    <motion.button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(mood.value)}
                        className={`px-4 py-2 rounded-full transition-all duration-200 font-bold text-sm sm:text-base ${
                            selectedMood === mood.value
                            ? 'ring-2 ring-accent ring-offset-2 ring-offset-light-card dark:ring-offset-dark-card'
                            : ''
                        } ${mood.color} ${mood.textColor}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {mood.label}
                    </motion.button>
                    ))}
                </div>

                <div className="flex-grow w-full bg-paper dark:bg-dark-paper rounded-lg shadow-inner overflow-hidden flex flex-col mt-6">
                    <textarea
                        id="thoughts"
                        className="w-full flex-grow p-4 bg-transparent focus:outline-none font-handwriting text-3xl leading-10
                                   text-light-text dark:text-dark-text placeholder-subtle-light dark:placeholder-subtle-dark
                                   bg-[linear-gradient(to_bottom,transparent_2.4rem,theme(colors.paper-lines)_2.5rem)]
                                   dark:bg-[linear-gradient(to_bottom,transparent_2.4rem,theme(colors.dark-paper-lines)_2.5rem)]
                                   bg-paper-lines"
                        placeholder="Inizia a scrivere..."
                        value={thoughts}
                        onChange={(e) => setThoughts(e.target.value)}
                        autoFocus
                        required
                    />
                </div>
            </main>
        </div>
    </motion.div>
  );
};

export default NewEntry;
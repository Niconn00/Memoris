import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJournal } from '../hooks/useJournal';
import { JournalEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodByValue, moods } from '../utils/moods';

const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const EmptyStateIllustration = () => (
    <svg viewBox="0 0 200 150" className="w-48 h-auto text-light-text dark:text-dark-text">
        <defs>
            <linearGradient id="sand-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F9E5A2" />
                <stop offset="100%" stopColor="#DD8C4E" />
            </linearGradient>
        </defs>
        {/* Ground */}
        <path d="M 0 150 Q 100 120, 200 150 L 200 150 L 0 150 Z" fill="url(#sand-gradient)" />

        {/* Pyramid */}
        <path d="M 80 130 L 120 130 L 100 90 Z" fill="#F9E5A2" stroke="#4A332D" strokeWidth="1.5" />
        <path d="M 30 130 L 70 130 L 50 100 Z" fill="#F9E5A2" stroke="#4A332D" strokeWidth="1.5" opacity="0.7"/>

        {/* Cactus */}
        <path d="M 150 130 V 100 C 150 90, 140 90, 140 100 V 110" stroke="#5A8D3B" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M 140 105 H 135 C 130 105, 130 95, 135 95" stroke="#5A8D3B" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
);


const EntryCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
  const { deleteEntry } = useJournal();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isConfirmingDelete, setConfirmingDelete] = React.useState(false);

  const moodDetails = getMoodByValue(entry.mood);

  const toggleMenu = () => {
    if (menuOpen) {
      setConfirmingDelete(false);
    }
    setMenuOpen(!menuOpen);
  };

  const handleDelete = () => {
    if (isConfirmingDelete) {
      deleteEntry(entry.id);
    } else {
      setConfirmingDelete(true);
    }
  };

  const handleEdit = () => {
    setMenuOpen(false);
    setConfirmingDelete(false);
    navigate(`/edit/${entry.id}`);
  };

  return (
    <motion.div 
      layout
      className="bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 ${moodDetails?.dot || 'bg-gray-400'}`}></div>
            <div className="flex flex-col min-w-0">
              <p className="font-bold text-light-text dark:text-dark-text truncate">{entry.thoughts.split('\n')[0] || 'Nessun titolo'}</p>
              <p className="text-xs text-subtle-light dark:text-subtle-dark">{formatDateTime(entry.date)}</p>
            </div>
        </div>
        
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="p-2 rounded-full text-subtle-light dark:text-subtle-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="Opzioni voce"
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
      </div>
    </motion.div>
  );
};


const JournalView: React.FC = () => {
  const { entries } = useJournal();
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string | null>(null);
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);

  const filteredEntries = selectedMoodFilter
    ? entries.filter(entry => entry.mood === selectedMoodFilter)
    : entries;

  const handleFilterSelect = (mood: string | null) => {
    setSelectedMoodFilter(mood);
    setFilterMenuOpen(false);
  }

  const isFilterActive = selectedMoodFilter !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <header className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Tutte le Voci</h1>
        
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setFilterMenuOpen(!isFilterMenuOpen)}
                className={`p-3 rounded-full transition-colors ${
                  isFilterActive 
                  ? 'text-accent bg-accent/10' 
                  : 'text-subtle-light dark:text-subtle-dark hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                aria-haspopup="true"
                aria-expanded={isFilterMenuOpen}
                aria-label="Filtra per sensazione"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.74.439L7 12.439V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                </svg>
                 {isFilterActive && <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></div>}
              </button>
              <AnimatePresence>
                {isFilterMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }}
                    className="absolute right-0 mt-2 w-56 bg-light-card dark:bg-dark-card rounded-xl shadow-lg z-20 ring-1 ring-black ring-opacity-5 p-2"
                  >
                    <div className="space-y-1">
                      <button
                        onClick={() => handleFilterSelect(null)}
                        className={`w-full text-left px-3 py-2 text-sm font-bold rounded-md transition-colors ${
                          !isFilterActive ? 'bg-accent text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        Tutti
                      </button>
                      {moods.map(mood => (
                        <button
                          key={mood.value}
                          onClick={() => handleFilterSelect(mood.value)}
                          className={`w-full text-left px-3 py-2 text-sm font-bold rounded-md transition-colors flex items-center gap-3 ${
                            selectedMoodFilter === mood.value
                              ? `${mood.color} ${mood.textColor} ring-2 ring-accent/80`
                              : `${mood.color} ${mood.textColor} opacity-70 hover:opacity-100`
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${mood.dot}`}></div>
                          {mood.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <Link to="/" className="text-accent font-bold px-4 py-2 rounded-md hover:bg-accent/10 transition-colors">
              Indietro
          </Link>
        </div>
      </header>

      {entries.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
            <div className="mb-4">
                <EmptyStateIllustration />
            </div>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Inizia la tua avventura</h2>
            <p className="mt-2 text-subtle-light dark:text-subtle-dark max-w-sm">Ogni grande viaggio inizia con un singolo passo. Scrivi la tua prima nota.</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Nessuna voce trovata</h2>
            <p className="mt-2 text-subtle-light dark:text-subtle-dark">Non ci sono voci che corrispondono a questo umore.</p>
        </div>
      ) : (
        <motion.div layout className="space-y-4">
            <AnimatePresence>
                {filteredEntries.map(entry => (
                    <EntryCard key={entry.id} entry={entry} />
                ))}
            </AnimatePresence>
        </motion.div>
      )}
      
      {/* Filter Menu Backdrop */}
      <AnimatePresence>
        {isFilterMenuOpen && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFilterMenuOpen(false)}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-10"
            />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JournalView;
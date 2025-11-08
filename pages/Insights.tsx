import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJournal } from '../hooks/useJournal';
import { moods, getMoodByValue } from '../utils/moods';
import { motion } from 'framer-motion';

// Helper to get the number of days in a month
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const Insights: React.FC = () => {
    const { entries } = useJournal();

    const moodStats = useMemo(() => {
        if (entries.length === 0) return { counts: {}, total: 0, mostFrequent: null };
        const counts = entries.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostFrequent = Object.keys(counts).length > 0
            ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
            : null;
        
        return {
            counts,
            total: entries.length,
            mostFrequent: mostFrequent ? { mood: mostFrequent[0], count: mostFrequent[1] } : null,
        };
    }, [entries]);

    const writingStreak = useMemo(() => {
        if (entries.length < 1) return 0;
        
        const entryDates = [...new Set(entries.map(e => new Date(new Date(e.date).toDateString()).getTime()))].sort((a, b) => b - a);

        if (entryDates.length === 0) return 0;

        let streak = 0;
        const today = new Date(new Date().toDateString()).getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (today - entryDates[0] <= oneDay) {
            streak = 1;
            for (let i = 0; i < entryDates.length - 1; i++) {
                const diff = entryDates[i] - entryDates[i + 1];
                if (diff === oneDay) {
                    streak++;
                } else if (diff > oneDay) {
                    break;
                }
            }
        }
        
        return streak;
    }, [entries]);
    
    const calendarData = useMemo(() => {
        const entriesByDate: { [key: string]: string } = {};
        // Reverse entries to prioritize the latest mood of the day
        [...entries].reverse().forEach(entry => {
            const dateStr = new Date(entry.date).toDateString();
            entriesByDate[dateStr] = entry.mood;
        });
        return entriesByDate;
    }, [entries]);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const renderCalendar = (year: number, month: number) => {
        // Handle month wrapping for previous years
        if (month < 0) {
            year -= 1;
            month = 11;
        }
        
        const monthName = new Date(year, month).toLocaleString('it-IT', { month: 'long' });
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const weekDayOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blanks = Array.from({ length: weekDayOffset }, (_, i) => i);
        const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

        return (
            <div className="bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg text-center mb-4 capitalize">{monthName} {year}</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-subtle-light dark:text-subtle-dark">
                    {dayNames.map(day => <div key={day} className="font-bold">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2">
                    {blanks.map(b => <div key={`blank-${month}-${b}`}></div>)}
                    {days.map(day => {
                        const date = new Date(year, month, day);
                        const dateStr = date.toDateString();
                        const moodValue = calendarData[dateStr];
                        const moodDetails = getMoodByValue(moodValue);
                        const isToday = dateStr === today.toDateString();
                        const isFuture = date > today;

                        return (
                            <div key={day} className={`w-full aspect-square flex items-center justify-center rounded-md relative ${isFuture ? 'opacity-40' : ''}`}>
                                <div className={`w-full h-full rounded-md ${moodDetails ? moodDetails.dot : 'bg-black/5 dark:bg-white/5'} transition-colors`}></div>
                                {isToday && <div className="absolute inset-0 border-2 border-accent rounded-md animate-pulse"></div>}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 py-8"
        >
            <header className="mb-8 flex items-center justify-between">
                <h1 className="text-5xl font-extrabold text-light-text dark:text-dark-text tracking-tighter">Insights</h1>
                <Link to="/" className="text-accent font-bold px-4 py-2 rounded-md hover:bg-accent/10 transition-colors">
                    Indietro
                </Link>
            </header>

            {entries.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                    <h2 className="text-2xl font-bold">Nessun dato da analizzare</h2>
                    <p className="mt-2 text-subtle-light dark:text-subtle-dark">Inizia a scrivere nel tuo diario per vedere qui le tue statistiche.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm text-center flex flex-col justify-center">
                            <p className="text-sm font-bold text-subtle-light dark:text-subtle-dark">Voci Totali</p>
                            <p className="text-4xl font-extrabold">{moodStats.total}</p>
                        </div>
                        <div className="bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm text-center flex flex-col justify-center">
                             <p className="text-sm font-bold text-subtle-light dark:text-subtle-dark">Sensazione Principale</p>
                             <p className="text-2xl font-extrabold capitalize mt-1">{moodStats.mostFrequent?.mood || '-'}</p>
                        </div>
                        <div className="bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm text-center flex flex-col justify-center">
                             <p className="text-sm font-bold text-subtle-light dark:text-subtle-dark">Serie di Scrittura</p>
                             <p className="text-4xl font-extrabold">{writingStreak}</p>
                             <p className="text-xs text-subtle-light dark:text-subtle-dark -mt-1">giorni</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Frequenza Sensazioni</h2>
                        <div className="bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-sm space-y-3">
                            {/* FIX: Create a shallow copy of moods before sorting, as it is a readonly array. */}
                            {[...moods].sort((a,b) => (moodStats.counts[b.value] || 0) - (moodStats.counts[a.value] || 0)).map(mood => {
                                const count = moodStats.counts[mood.value] || 0;
                                const percentage = moodStats.total > 0 ? (count / moodStats.total) * 100 : 0;
                                if (count === 0) return null;
                                return (
                                    <div key={mood.value} className="flex items-center gap-2 sm:gap-4">
                                        <span className="w-20 sm:w-24 capitalize font-semibold text-sm text-right">{mood.label}</span>
                                        <div className="flex-1 bg-black/10 dark:bg-white/10 rounded-full h-4 overflow-hidden">
                                            <motion.div
                                                className={`h-full rounded-full ${mood.dot}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.5, delay: 0.2, ease: "circOut" }}
                                            />
                                        </div>
                                        <span className="w-8 text-sm font-bold text-left">{count}</span>
                                    </div>
                                );
                            }).filter(Boolean)}
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Calendario delle Sensazioni</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {renderCalendar(currentYear, currentMonth)}
                           {renderCalendar(currentYear, currentMonth - 1)}
                        </div>
                    </div>

                </div>
            )}
        </motion.div>
    );
};

export default Insights;
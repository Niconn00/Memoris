import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { JournalProvider } from './context/JournalContext';
import { RemindersProvider } from './context/RemindersContext';
import NewEntry from './pages/NewEntry';
import JournalView from './pages/JournalView';
import Insights from './pages/Insights';
import Reminders from './pages/Reminders';
import { AnimatePresence } from 'framer-motion';
import NewReminder from './pages/NewReminder';
import Dashboard from './pages/Dashboard';
import SplashScreen from './pages/SplashScreen';

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/journal" element={<JournalView />} />
              <Route path="/new" element={<NewEntry />} />
              <Route path="/edit/:id" element={<NewEntry />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/new-reminder" element={<NewReminder />} />
              <Route path="/edit-reminder/:id" element={<NewReminder />} />
            </Routes>
        </AnimatePresence>
    )
}

const AppContent: React.FC = () => (
    <JournalProvider>
      <RemindersProvider>
        <HashRouter>
          <div className="min-h-screen font-sans">
              <AnimatedRoutes />
          </div>
        </HashRouter>
      </RemindersProvider>
    </JournalProvider>
);


const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // Splash screen for 2.5 seconds

        return () => clearTimeout(timer);
    }, []);

  return (
    <AnimatePresence mode="wait">
        {isLoading ? (
            <SplashScreen key="splash" />
        ) : (
            <AppContent key="main-app" />
        )}
    </AnimatePresence>
  );
};

export default App;
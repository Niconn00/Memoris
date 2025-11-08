import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen: React.FC = () => {
    return (
        <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-light-bg dark:bg-dark-bg flex flex-col items-center justify-center z-50"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
            >
                <h1 className="text-6xl font-extrabold text-light-text dark:text-dark-text tracking-tighter font-sans">
                    Memories
                </h1>
                <p className="text-center text-lg text-subtle-light dark:text-subtle-dark mt-2 font-handwriting">
                    Il tuo diario personale.
                </p>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;

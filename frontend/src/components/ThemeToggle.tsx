'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[80px] h-[40px] rounded-full bg-foreground/10" />;
  }

  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        animate={{
          backgroundColor: isDark ? '#0f172a' : '#60a5fa',
          borderColor: isDark ? '#334155' : '#bfdbfe',
          boxShadow: isDark 
            ? '0 0 15px rgba(30, 41, 59, 0.5)' 
            : '0 0 15px rgba(96, 165, 250, 0.5)'
        }}
        className="relative w-[80px] h-[40px] rounded-full p-1 border-2 focus:outline-none overflow-hidden"
        aria-label="Toggle theme"
        whileTap={{ scale: 0.95 }}
      >
        {/* Scenary Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg viewBox="0 0 499.712 499.712" className="w-6 h-6">
                  <path style={{ fill: '#FFD93B' }} d="M146.88,375.528c126.272,0,228.624-102.368,228.624-228.64c0-55.952-20.16-107.136-53.52-146.88 C425.056,33.096,499.696,129.64,499.696,243.704c0,141.392-114.608,256-256,256c-114.064,0-210.608-74.64-243.696-177.712 C39.744,355.368,90.944,375.528,146.88,375.528z" />
                  <path style={{ fill: '#F4C534' }} d="M401.92,42.776c34.24,43.504,54.816,98.272,54.816,157.952c0,141.392-114.608,256-256,256 c-59.68,0-114.448-20.576-157.952-54.816c46.848,59.472,119.344,97.792,200.928,97.792c141.392,0,256-114.608,256-256 C499.712,162.12,461.392,89.64,401.92,42.776z" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-auto"
              >
                <svg viewBox="0 0 512 512" className="w-6 h-6">
                  <circle style={{ fill: '#FFD347' }} cx="255.997" cy="255.997" r="144.824" />
                  <path style={{ fill: '#FFD347' }} d="M256,56.849c-4.273,0-7.737-3.463-7.737-7.737V7.737C248.263,3.463,251.727,0,256,0 s7.737,3.463,7.737,7.737v41.376C263.737,53.386,260.273,56.849,256,56.849z" />
                  <path style={{ fill: '#FFD347' }} d="M152.563,84.568c-2.674,0-5.274-1.387-6.707-3.869l-20.687-35.832 c-2.136-3.7-0.869-8.432,2.832-10.569c3.701-2.134,8.432-0.87,10.569,2.832l20.687,35.832c2.136,3.7,0.869,8.432-2.832,10.569z" />
                  <path style={{ fill: '#FFD347' }} d="M49.112,263.737H7.737C3.464,263.737,0,260.274,0,256s3.464-7.737,7.737-7.737h41.376 c4.273,0,7.737,3.463,7.737,7.737S53.385,263.737,49.112,263.737z" />
                  <path style={{ fill: '#FFD347' }} d="M256,512c-4.273,0-7.737-3.463-7.737-7.737v-41.376c0-4.274,3.464-7.737,7.737-7.737 s7.737,3.463,7.737,7.737v41.376C263.737,508.537,260.273,512,256,512z" />
                  <path style={{ fill: '#FFD347' }} d="M504.263,263.737h-41.376c-4.273,0-7.737-3.463-7.737-7.737s3.464-7.737,7.737-7.737h41.376 c4.273,0,7.737,3.463,7.737,7.737S508.536,263.737,504.263,263.737z" />
                  <path style={{ fill: '#FFBE31' }} d="M256,111.18c-5.242,0-10.418,0.286-15.516,0.828c72.685,7.743,129.303,69.252,129.303,143.991 s-56.619,136.249-129.303,143.992c5.098,0.544,10.273,0.828,15.516,0.828c79.982,0,144.82-64.838,144.82-144.82 S335.983,111.18,256,111.18z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rolling Ball */}
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          animate={{
            x: isDark ? 40 : 0,
            backgroundColor: isDark ? '#94a3b8' : '#ffffff',
          }}
          className="relative w-[32px] h-[32px] rounded-full shadow-lg border-2 border-transparent z-10"
        />
      </motion.button>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence, SVGMotionProps } from 'framer-motion';

const MENU_ITEMS = [
  { title: 'Главная', href: '/' },
  { title: 'Калькулятор урона', href: '/calculator' },
  { title: 'Калькулятор защиты', href: '/defense' },
  { title: 'Винрейт', href: '/winrate' },
  { title: 'Прогресс сезона', href: '/season' },
  { title: 'База героев', href: '/heroes' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Блокируем скролл body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    // Using setTimeout to avoid "Calling setState synchronously within an effect" warning.
    // This allows the current render to finish before updating state.
    const timer = setTimeout(() => setIsOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // SVG Path Props
  const pathProps: SVGMotionProps<SVGPathElement> = {
    strokeWidth: "3",
    strokeLinecap: "round",
    className: "neon-stroke"
  };

  return (
    <>
      {/* 1. Navbar (Logo + Actions) */}
      <nav className="fixed top-0 left-0 right-0 z-[60] h-20 flex items-center justify-between px-6 md:px-12 bg-background/50 backdrop-blur-sm border-b border-foreground/5">
        
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-black uppercase tracking-tighter hover:opacity-80 transition-opacity z-[60] neon-text-active">
            MLBB Helper
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary
                    ${isActive ? 'text-primary' : 'text-muted-foreground'}
                  `}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-6">
           <div className="hidden md:block">
             <ThemeToggle />
           </div>
           
           {/* Hamburger - Show only on mobile/tablet (lg and below) */}
           <div className="lg:hidden w-12 h-12"></div> 
        </div>
      </nav>

      {/* 2. Floating Burger Button (FIXED on top of everything) - Only visible on lg and smaller */}
      <button 
        onClick={toggleMenu}
        className="fixed top-4 right-6 md:right-12 z-[110] w-12 h-12 flex items-center justify-center focus:outline-none group text-foreground lg:hidden"
      >
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="group-hover:text-primary transition-colors duration-300"
        >
          <motion.path {...pathProps} variants={{ closed: { d: "M 2 6 L 22 6" }, open: { d: "M 3 16.5 L 17 2.5" } }} />
          <motion.path {...pathProps} d="M 2 12 L 22 12" variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} transition={{ duration: 0.1 }} />
          <motion.path {...pathProps} variants={{ closed: { d: "M 2 18 L 22 18" }, open: { d: "M 3 2.5 L 17 16.5" } }} />
        </motion.svg>
      </button>

      {/* 3. Drawer & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (z-90) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
            />

            {/* Drawer (z-100) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-background border-l-2 border-primary/30 shadow-[-10px_0_40px_rgba(6,182,212,0.2)] z-[100] flex flex-col justify-center px-8 md:px-16 lg:hidden"
            >
              <div className="flex flex-col space-y-6">
                 <div className="md:hidden absolute top-6 left-6">
                    <ThemeToggle />
                 </div>

                {MENU_ITEMS.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + idx * 0.1 }}
                    >
                      <Link 
                        href={item.href}
                        className={`text-3xl md:text-4xl font-black uppercase tracking-tighter transition-transform duration-300 hover:translate-x-4 inline-block
                          ${isActive ? 'text-primary neon-text-active' : 'text-muted hover:text-foreground'}
                        `}
                      >
                         {item.title}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-8 right-8 text-xs text-muted uppercase tracking-widest border-t border-foreground/10 pt-4"
              >
                <p>MLBB Helper v2.0</p>
                <p>Created by T-Way</p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md neon-line-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl md:text-2xl font-black neon-text-active uppercase tracking-tighter">
              MLBB Helper
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-2">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="neon-text-active px-3 py-2 rounded-md text-sm font-black uppercase tracking-tighter"
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>

          {/* Burger Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <div 
                  className="w-8 h-8 neon-icon-mask"
                  style={{ 
                    WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'2.5\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M6 18L18 6M6 6l12 12\' /%3E%3C/svg%3E")'
                  }}
                />
              ) : (
                <div 
                  className="w-8 h-8 neon-icon-mask"
                  style={{ 
                    WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'2.5\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5\' /%3E%3C/svg%3E")'
                  }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-foreground/10 slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="neon-text-active block px-3 py-4 rounded-md text-lg font-black uppercase tracking-tighter"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

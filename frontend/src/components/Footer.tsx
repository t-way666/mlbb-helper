'use client';

import React from 'react';
import { Github, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-foreground/5 bg-background/50 backdrop-blur-md py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand/Copyright */}
        <div className="text-center md:text-left space-y-2">
          <h3 className="text-xl font-black neon-text-active uppercase tracking-tighter">
            MLBB Helper
          </h3>
          <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} • Created by Wayer
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          <a 
            href="https://t.me/T_w_a_y" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center transition-all group-hover:border-[#229ED9] group-hover:shadow-[0_0_15px_rgba(34,158,217,0.4)] group-hover:bg-[#229ED9]/10">
              <Send className="w-5 h-5 text-muted group-hover:text-[#229ED9] transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">Telegram</span>
          </a>

          <a 
            href="https://github.com/t-way666" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full border-2 border-foreground/10 flex items-center justify-center transition-all group-hover:border-foreground group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:bg-foreground/10">
              <Github className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">GitHub</span>
          </a>
        </div>

        {/* Motivation */}
        <div className="hidden lg:block max-w-[200px] text-right">
          <p className="text-[10px] text-muted italic leading-relaxed">
            Разработано с любовью к Mobile Legends и чистой математике урона.
          </p>
        </div>

      </div>
    </footer>
  );
}

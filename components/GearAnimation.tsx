
import React from 'react';
import { Settings, RefreshCw, Disc } from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../translations';

interface GearAnimationProps {
  lang: Language;
  theme: Theme;
}

const GearAnimation: React.FC<GearAnimationProps> = ({ lang, theme }) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md transition-colors duration-500 ${isDark ? 'bg-slate-950/80' : 'bg-white/80'}`}>
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Main large gear */}
        <div className={`absolute animate-[spin_4s_linear_infinite] ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
          <Settings size={120} strokeWidth={1.5} />
        </div>
        {/* Medium gear - clockwise */}
        <div className={`absolute -top-4 -right-4 animate-[spin_3s_linear_infinite] ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>
          <Disc size={64} strokeWidth={2} />
        </div>
        {/* Small gear - counter-clockwise */}
        <div className={`absolute -bottom-2 -left-2 animate-[spin_2s_linear_infinite_reverse] ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`}>
          <RefreshCw size={48} strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-8 text-center px-6">
        <h2 className={`text-xl font-bold tracking-widest mono uppercase animate-pulse ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
          {t.processing}
        </h2>
        <p className={`mt-2 font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.verifying}
        </p>
      </div>
      
      {/* Decorative scanning line */}
      <div className={`absolute inset-0 scanner overflow-hidden pointer-events-none opacity-20 ${isDark ? '' : 'invert'}`} />
    </div>
  );
};

export default GearAnimation;

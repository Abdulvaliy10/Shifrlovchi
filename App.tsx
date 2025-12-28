
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Lock, Unlock, Zap, FileCode, Server, Sun, Moon, ChevronDown, Github, Send, Linkedin } from 'lucide-react';
import CryptoCard from './components/CryptoCard';
import GearAnimation from './components/GearAnimation';
import { OperationMode, Language, Theme } from './types';
import { translations } from './translations';
import { encryptText, decryptText } from './services/cryptoService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('uz');
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeMode, setActiveMode] = useState<OperationMode>(OperationMode.ENCRYPT);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  const langRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];
  const isDark = theme === 'dark';

  useEffect(() => {
    document.body.className = isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900';
    
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [theme]);

  const handleProcess = async (text: string, password: string) => {
    setIsLoading(true);
    setResult('');
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = activeMode === OperationMode.ENCRYPT 
      ? encryptText(text, password) 
      : decryptText(text, password);

    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.errorKey || 'errorFailed');
    }

    setIsLoading(false);
  };

  const handleClear = useCallback(() => {
    setResult('');
    setError(null);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const languages: { key: Language; flag: string; label: string }[] = [
    { key: 'uz', flag: 'https://flagcdn.com/uz.svg', label: 'Oʻzbek' },
    { key: 'en', flag: 'https://flagcdn.com/gb.svg', label: 'English' },
    { key: 'tr', flag: 'https://flagcdn.com/tr.svg', label: 'Türkçe' },
  ];

  const currentLangObj = languages.find(l => l.key === lang) || languages[0];

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-500 ${isDark ? 'cyber-grid' : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]'}`}>
      {isLoading && <GearAnimation lang={lang} theme={theme} />}

      {/* Header */}
      <header className={`border-b sticky top-0 z-40 transition-all duration-500 backdrop-blur-xl ${isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white/90'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shadow-lg transition-all ${isDark ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-emerald-600 shadow-emerald-600/10'}`}>
              <Shield className={isDark ? 'text-slate-950' : 'text-white'} size={22} strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
                {t.title.slice(0, 5)}<span className="text-emerald-500">{t.title.slice(5)}</span>
              </h1>
              <p className={`text-[8px] font-black mono tracking-[0.25em] ${isDark ? 'text-emerald-500/60' : 'text-emerald-600/60'}`}>{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 active:scale-95 group ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-emerald-500/50' 
                    : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-emerald-600 hover:shadow-md'
                }`}
              >
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all ${
                  isDark ? 'border-slate-700' : 'border-slate-200 shadow-inner'
                }`}>
                  <img src={currentLangObj.flag} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-black mono uppercase tracking-wider hidden xs:inline-block">
                  {currentLangObj.label}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 opacity-50 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className={`absolute top-full right-0 mt-2 w-44 rounded-2xl border p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-50 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  {languages.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => { setLang(l.key); setIsLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        lang === l.key 
                          ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                          : (isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full overflow-hidden border-2 ${
                        lang === l.key ? 'border-emerald-500/50' : (isDark ? 'border-slate-700' : 'border-slate-200')
                      }`}>
                        <img src={l.flag} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold mono uppercase tracking-tight">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className={`p-2.5 rounded-xl border transition-all transform hover:scale-105 active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800 text-yellow-500 hover:bg-slate-800 hover:border-yellow-500/30' : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:shadow-md hover:border-slate-300'}`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-7xl font-black leading-tight tracking-tighter">
            {t.heroTitle.split(' ').map((word, i) => (
              i >= t.heroTitle.split(' ').length - 2 ? (
                <span key={i} className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-emerald-400 to-cyan-400' : 'from-emerald-600 to-cyan-600'}`}> {word}</span>
              ) : <span key={i}> {word}</span>
            ))}
          </h2>
          <p className={`max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.heroDesc}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className={`p-1.5 rounded-3xl border flex items-center transition-all duration-500 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
            <button
              onClick={() => { setActiveMode(OperationMode.ENCRYPT); handleClear(); }}
              className={`px-8 md:px-12 py-4 rounded-2xl flex items-center gap-3 font-black mono text-xs tracking-widest transition-all ${
                activeMode === OperationMode.ENCRYPT 
                  ? (isDark ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20')
                  : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
              }`}
            >
              <Lock size={16} strokeWidth={2.5} />
              <span className="xs:inline">{t.encrypt}</span>
            </button>
            <button
              onClick={() => { setActiveMode(OperationMode.DECRYPT); handleClear(); }}
              className={`px-8 md:px-12 py-4 rounded-2xl flex items-center gap-3 font-black mono text-xs tracking-widest transition-all ${
                activeMode === OperationMode.DECRYPT 
                  ? (isDark ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20')
                  : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
              }`}
            >
              <Unlock size={16} strokeWidth={2.5} />
              <span className="xs:inline">{t.decrypt}</span>
            </button>
          </div>
        </div>

        <CryptoCard 
          mode={activeMode} 
          onProcess={handleProcess} 
          onClear={handleClear}
          result={result} 
          error={error}
          lang={lang}
          theme={theme}
        />

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-yellow-500" />, title: t.feature1Title, desc: t.feature1Desc },
            { icon: <FileCode className="text-blue-500" />, title: t.feature2Title, desc: t.feature2Desc },
            { icon: <Server className="text-purple-500" />, title: t.feature3Title, desc: t.feature3Desc }
          ].map((f, i) => (
            <div key={i} className={`p-8 rounded-3xl border transition-all duration-500 group ${isDark ? 'bg-slate-900/30 border-slate-800 hover:border-emerald-500/30' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'}`}>
              <div className={`mb-6 w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                {f.icon}
              </div>
              <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors duration-500 ${isDark ? 'border-slate-900 bg-slate-950/90' : 'border-slate-100 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h4 className={`font-black mono text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.title.toUpperCase()} <span className="text-emerald-500">v2.0</span>
            </h4>
            <p className="text-[10px] text-slate-500 font-bold mono mt-1">© 2024 {t.footerRights}</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <span className={`text-[10px] font-black mono tracking-[0.2em] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.aboutFounder}:
            </span>
            <div className="flex gap-5">
              <a href="https://github.com/Abdulvaliy10" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-xl border transition-all transform hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 shadow-sm'}`}>
                <Github size={18} />
              </a>
              <a href="https://t.me/iamabdulvaliy" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-xl border transition-all transform hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 shadow-sm'}`}>
                <Send size={18} />
              </a>
              <a href="https://linkedin.com/in/abdulvaliy" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-xl border transition-all transform hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 shadow-sm'}`}>
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className={`text-[10px] max-w-xs text-center md:text-right font-medium italic ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            {t.footerDisclaimer}
          </div>
        </div>
      </footer>

      <div className={`fixed top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[160px] rounded-full -z-10 pointer-events-none transition-all duration-1000 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`} />
      <div className={`fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[160px] rounded-full -z-10 pointer-events-none transition-all duration-1000 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'}`} />
    </div>
  );
};

export default App;

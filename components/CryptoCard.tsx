
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, Copy, Check, Eye, EyeOff, AlertTriangle, Trash2 } from 'lucide-react';
import { OperationMode, Language, Theme } from '../types';
import { translations } from '../translations';

interface CryptoCardProps {
  mode: OperationMode;
  onProcess: (text: string, password: string) => void;
  onClear: () => void;
  result: string;
  error: string | null;
  lang: Language;
  theme: Theme;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ mode, onProcess, onClear, result, error, lang, theme }) => {
  const t = translations[lang];
  const isDark = theme === 'dark';
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-clear results if text is manually emptied
  useEffect(() => {
    if (text === '') {
      onClear();
    }
  }, [text, onClear]);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearAll = () => {
    setText('');
    setPassword('');
    onClear();
  };

  const isEncrypt = mode === OperationMode.ENCRYPT;

  const cardBaseStyles = isDark 
    ? "bg-slate-900/50 border-slate-800 shadow-2xl" 
    : "bg-white border-slate-200 shadow-xl shadow-slate-200/50";

  const inputBaseStyles = isDark
    ? "bg-slate-950 border-slate-700 text-slate-200 focus:ring-emerald-500/50 focus:border-emerald-500"
    : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-emerald-600/30 focus:border-emerald-600";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className={`border rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group transition-all duration-500 ${cardBaseStyles}`}>
        {/* Card Header Decoration */}
        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {isEncrypt ? <Lock size={120} /> : <Unlock size={120} />}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          {/* Left Side: Inputs */}
          <div className="flex-1 space-y-6">
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className={`block text-xs font-bold mono tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isEncrypt ? t.inputText : t.inputCipher}
                </label>
                <button
                  onClick={handleClearAll}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black mono tracking-tighter transition-all active:scale-95 ${
                    isDark 
                      ? 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10' 
                      : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 size={12} />
                  {t.clearAll}
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isEncrypt ? t.placeholderText : t.placeholderCipher}
                className={`w-full h-48 border rounded-2xl p-4 placeholder-slate-500 transition-all resize-none mono outline-none ${inputBaseStyles}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-2 mono tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className={`w-full border rounded-2xl py-4 pl-5 pr-12 placeholder-slate-500 transition-all mono outline-none ${inputBaseStyles}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => onProcess(text, password)}
              disabled={!text || !password}
              className={`w-full py-4 rounded-2xl font-black tracking-widest flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
                isEncrypt 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)]' 
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_10px_30px_rgba(8,145,178,0.3)]'
              } disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none text-white`}
            >
              {isEncrypt ? <Lock size={20} strokeWidth={2.5} /> : <Unlock size={20} strokeWidth={2.5} />}
              {isEncrypt ? t.encrypt : t.decrypt}
            </button>
          </div>

          {/* Right Side: Results/Status */}
          <div className="md:w-1/3 flex flex-col gap-6">
            <div className={`p-6 rounded-2xl border min-h-[160px] flex flex-col justify-between transition-all duration-500 ${
              error 
                ? 'bg-red-500/10 border-red-500/50' 
                : result 
                ? (isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200 shadow-inner')
                : (isDark ? 'bg-slate-950/50 border-slate-700' : 'bg-slate-50 border-slate-100')
            }`}>
              {error ? (
                <div className="text-center space-y-3 py-4">
                  <div className="inline-block p-3 rounded-full bg-red-500/20 text-red-500">
                    <AlertTriangle size={32} />
                  </div>
                  <p className="text-red-600 dark:text-red-400 text-sm font-bold">{translations[lang][error as keyof typeof t] || error}</p>
                </div>
              ) : result ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black mono tracking-widest ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>{t.resultLabel}</span>
                    <button 
                      onClick={handleCopy}
                      className="text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      {copied ? t.copied : t.copy}
                    </button>
                  </div>
                  <div className="flex-grow overflow-auto max-h-40 scrollbar-hide">
                    <p className={`text-sm break-all mono leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>{result}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 opacity-30">
                  <Shield size={48} className="mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">IDLE_MODE</p>
                </div>
              )}
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 transition-colors duration-500 ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-amber-50/50 border-amber-100'}`}>
              <h4 className={`text-[10px] font-black mono uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-amber-700'}`}>{t.securityNoteTitle}</h4>
              <p className={`text-[11px] leading-relaxed italic ${isDark ? 'text-slate-400' : 'text-amber-800/80'}`}>
                {t.securityNoteDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;

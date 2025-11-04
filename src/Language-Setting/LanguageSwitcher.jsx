import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'ENG', flag: '🇬🇧', nameKey: 'english' },
  { code: 'FR', flag: '🇫🇷', nameKey: 'french' },
  { code: 'DU', flag: '🇳🇱', nameKey: 'nederlands' }
];

const LanguageSwitcher = ({color=false}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(() => {
    const saved = localStorage.getItem('language');
    return languages.find(lang => lang.code === saved) || languages[0];
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang.code);
    localStorage.setItem('language', lang.code);
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[160px] px-4 py-2 text-sm rounded-lg transition-all  backdrop-blur-sm 
                 border border-white/20 text-white flex items-center justify-between ${color ? "bg-black/50" : 'hover:bg-blue-500/20'}`}
      >
        <div className="flex items-center gap-2">
          <span>{selectedLang.flag}</span>
          <span>{t(`languages.${selectedLang.nameKey}`)}</span>
        </div>
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-[160px] bg-[#323335]/90 backdrop-blur-md border border-white/10 
                     rounded-lg shadow-lg overflow-hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang)}
                className={`w-full px-4 py-2 text-sm text-left text-white hover:bg-blue-500/20 flex items-center gap-2
                         transition-colors ${selectedLang.code === lang.code ? 'bg-blue-500/20' : ''}`}
              >
                <span>{lang.flag}</span>
                <span>{t(`languages.${lang.nameKey}`)}</span>
                {selectedLang.code === lang.code && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-blue-400"
                  >
                    ✓
                  </motion.span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;

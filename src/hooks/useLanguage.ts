import { useState, useEffect } from 'react';
import { Language } from '../types';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'th'; // Default to Thai
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return { language, changeLanguage };
};
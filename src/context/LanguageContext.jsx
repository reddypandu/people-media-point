import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateText } from '../services/translateService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or detect browser language
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app_language');
    if (saved) return saved;
    return 'te'; // Default to Telugu
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.lang = language;
    document.body.className = `lang-${language}`;
  }, [language]);

  /**
   * Helper function to translate content within components
   */
  const translateContent = async (text) => {
    if (!text) return text;
    return await translateText(text, language);
  };

  const value = {
    language,
    setLanguage,
    translateContent,
    isLoading,
    setIsLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

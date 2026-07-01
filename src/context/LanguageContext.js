"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/locales/en';
import { hi } from '@/locales/hi';
import { ja } from '@/locales/ja';

const LanguageContext = createContext();

export const dictionaries = { en, hi, ja };

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  // Load language from localStorage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('app-language');
    if (savedLang && dictionaries[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (dictionaries[lang]) {
      setLanguage(lang);
      localStorage.setItem('app-language', lang);
    }
  };

  // Helper function to get nested object properties using string path (e.g. "hero.title")
  const t = (path, replacements = {}) => {
    const keys = path.split('.');
    let result = dictionaries[language];

    for (let key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to English if translation is missing
        let fallbackResult = dictionaries['en'];
        for (let k of keys) {
          if (fallbackResult && fallbackResult[k] !== undefined) {
            fallbackResult = fallbackResult[k];
          } else {
            return path; // return the path as string if even English is missing
          }
        }
        result = fallbackResult;
        break;
      }
    }

    // Handle template replacements (e.g., {name})
    if (typeof result === 'string' && Object.keys(replacements).length > 0) {
      Object.keys(replacements).forEach((key) => {
        result = result.replace(new RegExp(`{${key}}`, 'g'), replacements[key]);
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

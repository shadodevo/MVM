

import { useCallback } from 'react';
import { useApp } from './useApp';
import { translations } from '../lib/translations';

export const useTranslation = () => {
  const { language } = useApp();

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    let translation = translations[language][key] || key;

    if (replacements) {
      Object.keys(replacements).forEach(replaceKey => {
        const regex = new RegExp(`{${replaceKey}}`, 'g');
        translation = translation.replace(regex, replacements[replaceKey]);
      });
    }

    return translation;
  }, [language]);

  return { t, language };
};
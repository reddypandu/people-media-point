import { TRANSLATION_DICTIONARY } from '../constants/translations';

/**
 * Translation Service for Google Translate API v2
 * Includes localStorage caching to minimize API costs and improve performance.
 */

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

const CACHE_PREFIX = 'translation_cache_';
const CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Translates a given text to the target language.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The target language code (e.g., 'te', 'hi').
 * @returns {Promise<string>} - The translated text.
 */
export const translateText = async (text, targetLang) => {
  if (!text) return text;

  // 1. Check Dictionary First (Reliable and Instant)
  if (TRANSLATION_DICTIONARY[targetLang] && TRANSLATION_DICTIONARY[targetLang][text]) {
    return TRANSLATION_DICTIONARY[targetLang][text];
  }

  const cacheKey = `${CACHE_PREFIX}${targetLang}_${btoa(encodeURIComponent(text)).slice(0, 50)}`;
  
  // 2. Check Cache
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { translation, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return translation;
    }
  }

  // 3. API Call with Retry/Delay logic
  const fetchWithRetry = async (retries = 2) => {
    try {
      // Add a small random delay to avoid simultaneous requests hitting rate limits
      await new Promise(resolve => setTimeout(resolve, Math.random() * 800));
      
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s if rate limited
          return fetchWithRetry(retries - 1);
        }
        throw new Error('Translation failed');
      }

      const data = await response.json();
      let translation = '';
      if (data && data[0]) {
          data[0].forEach(item => {
              if (item[0]) translation += item[0];
          });
      }

      if (!translation) return text;

      // Save to Cache
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          translation,
          timestamp: Date.now(),
        })
      );

      return translation;
    } catch (error) {
      if (retries > 0) {
        return fetchWithRetry(retries - 1);
      }
      console.error('Translation Error:', error);
      return text;
    }
  };

  return await fetchWithRetry();
};

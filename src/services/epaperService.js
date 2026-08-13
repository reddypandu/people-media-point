import { supabase } from '../supabase';

const LOCAL_EPAPER_KEY = 'pmp_latest_epaper';

const DEFAULT_EPAPER_PDF = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const DEFAULT_EPAPER_THUMB = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80';

/**
 * Get latest published E-Paper URL and metadata
 */
export const getLatestEpaper = async () => {
  // 1. Check LocalStorage first for instant offline/persistent speed
  const localData = localStorage.getItem(LOCAL_EPAPER_KEY);
  let result = null;

  if (localData) {
    try {
      result = JSON.parse(localData);
    } catch (e) {
      console.log('Error parsing local epaper');
    }
  }

  // 2. Fetch from Supabase database
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('title', 'Daily E-Paper')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data && data.content) {
      result = {
        content: data.content,
        image_url: data.image_url || DEFAULT_EPAPER_THUMB,
        created_at: data.created_at || new Date().toISOString()
      };
      // Cache in localStorage
      localStorage.setItem(LOCAL_EPAPER_KEY, JSON.stringify(result));
    }
  } catch (e) {
    console.log('Using local cached epaper');
  }

  if (!result || !result.content) {
    result = {
      content: DEFAULT_EPAPER_PDF,
      image_url: DEFAULT_EPAPER_THUMB,
      created_at: new Date().toISOString()
    };
  }

  return result;
};

/**
 * Save new published E-Paper PDF and optional thumbnail
 */
export const saveLatestEpaper = async (pdfUrl, imageUrl) => {
  const epaperRecord = {
    content: pdfUrl,
    image_url: imageUrl || DEFAULT_EPAPER_THUMB,
    created_at: new Date().toISOString()
  };

  // 1. Save to LocalStorage immediately
  localStorage.setItem(LOCAL_EPAPER_KEY, JSON.stringify(epaperRecord));

  // 2. Save/Update in Supabase Database
  try {
    // Delete existing E-Paper entries to keep single latest edition
    await supabase.from('articles').delete().eq('title', 'Daily E-Paper');

    await supabase.from('articles').insert([{
      title: 'Daily E-Paper',
      content: pdfUrl,
      image_url: imageUrl || DEFAULT_EPAPER_THUMB,
      author: 'Admin',
      is_hero_slider: false,
      is_top_hero: false
    }]);
  } catch (e) {
    console.warn('Supabase DB notice:', e.message);
  }

  return epaperRecord;
};

/**
 * Delete current E-Paper
 */
export const removeLatestEpaper = async () => {
  localStorage.removeItem(LOCAL_EPAPER_KEY);
  try {
    await supabase.from('articles').delete().eq('title', 'Daily E-Paper');
  } catch (e) {
    console.log('Epaper deleted from DB');
  }
};

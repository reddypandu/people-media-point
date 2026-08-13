import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleCategories = [
  { name: 'Latest News', slug: 'latest-news' },
  { name: 'Telangana', slug: 'telangana' },
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
  { name: 'National', slug: 'national' },
  { name: 'International', slug: 'international' },
  { name: 'Politics', slug: 'politics' },
  { name: 'Crime', slug: 'crime' },
  { name: 'Movie', slug: 'movie' },
  { name: 'Lifestyle', slug: 'lifestyle' },
  { name: 'Business', slug: 'business' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Videos', slug: 'videos' },
  { name: 'Education', slug: 'education' },
  { name: 'Health', slug: 'health' },
  { name: 'Spiritual', slug: 'spiritual' }
];

const sampleArticles = [
  {
    title: 'తెలంగాణలో భారీగా ఉద్యోగ ప్రకటన: హెచ్‌ఎమ్‌డీఏ లో కొత్త నోటిఫికేషన్!',
    content: 'హైదరాబాద్ మెట్రోపాలిటన్ డెవలప్‌మెంట్ అథారిటీ (HMDA) పరిధిలో వివిధ పోస్టుల భర్తీకి త్వరలో నోటిఫికేషన్ విడుదల చేయనున్నట్లు అధికారులు ప్రకటించారు. నిరుద్యోగ యువతకు ఇది శుభవార్త.',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Chief Reporter',
    is_hero_slider: true,
    is_top_hero: true,
    created_at: new Date().toISOString()
  },
  {
    title: 'ఆంధ్రప్రదేశ్‌లో కొత్త ఇండస్ట్రియల్ కారిడార్: వేలాది కుటుంబాలకు మేలు',
    content: 'విశాఖపట్నం-చెన్నై ఇండస్ట్రియల్ కారిడార్ పనులు వేగవంతం చేయాలని ముఖ్యమంత్రి అధికారులను ఆదేశించారు. దీనిద్వారా రాష్ట్రంలో పెట్టుబడులు పెరిగి ఉద్యోగాలు లభిస్తాయి.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
    author: 'Special Correspondent',
    is_hero_slider: true,
    is_top_hero: true,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    title: 'టాలీవుడ్ సంచలనం: పాన్ ఇండియా మూవీ కొత్త పోస్టర్ విడుదల!',
    content: 'చిత్రపరిశ్రమలో అత్యంత భారీ బడ్జెట్‌తో తెరకెక్కుతున్న నూతన చిత్రం మోషన్ పోస్టర్ ఈరోజు సాయంత్రం 5 గంటలకు విడుదల కానుంది. అభిమానులు అత్యంత ఆసక్తిగా ఎదురుచూస్తున్నారు.',
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Movie Desk',
    is_hero_slider: true,
    is_top_hero: true,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    title: 'కేంద్ర బడ్జెట్ 2026: తెలుగు రాష్ట్రాలకు ప్రత్యేక కేటాయింపులు!',
    content: 'కేంద్ర ప్రభుత్వం ప్రవేశపెట్టిన నూతన బడ్జెట్‌లో రెండు తెలుగు రాష్ట్రాల్లోని రైల్వే ప్రాజెక్టులకు మరియు జాతీయ రహదారులకు ఆశించిన స్థాయి నిధులు కేటాయించారు.',
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    author: 'Political Analyst',
    is_hero_slider: true,
    is_top_hero: false,
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    title: 'హైదరాబాద్‌లో ఐటీ విస్తరణ: గచ్చిబౌలిలో సరికొత్త గ్లోబల్ కేంద్రాన్ని ప్రారంభించిన టెక్ దిగ్గజం',
    content: 'నగరంలో ఐటీ రంగం నిలకడగా ఎదుగుతోంది. గచ్చిబౌలి ప్రాంతంలో కొత్త పరిశోధన మరియు అభివృద్ధి కేంద్రాన్ని ఏర్పాటు చేశారు.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    author: 'Tech Reporter',
    is_hero_slider: true,
    is_top_hero: false,
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    title: 'భారత క్రికెట్ జట్టు విజయం: రికార్డు భాగస్వామ్యంతో కప్ కైవసం!',
    content: 'చివరి ఓవర్ వరకు ఉత్కంఠభరితంగా సాగిన మ్యాచ్‌లో టీమిండియా చిరస్మరణీయ విజయాన్ని అందుకుంది. క్రీడాభిమానులు సంబరాలు చేసుకుంటున్నారు.',
    image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    author: 'Sports Desk',
    is_hero_slider: false,
    is_top_hero: false,
    created_at: new Date(Date.now() - 18000000).toISOString()
  }
];

async function seedData() {
  console.log('Testing Supabase Connection & Schema...');
  
  // 1. Check categories table
  const { data: catData, error: catErr } = await supabase.from('categories').select('*').limit(1);
  if (catErr) {
    console.error('Categories Table Error:', catErr.message);
    console.log('\n--- SQL SCHEMA INSTRUCTIONS FOR SUPABASE ---');
    console.log('Please execute the code inside supabase/schema.sql in your Supabase SQL Editor.');
    return;
  }
  
  console.log('Categories table exists!');
  
  // Seed categories if empty
  const { data: existingCats } = await supabase.from('categories').select('id');
  if (!existingCats || existingCats.length === 0) {
    console.log('Seeding Categories...');
    const { error: seedCatErr } = await supabase.from('categories').insert(sampleCategories);
    if (seedCatErr) console.error('Error seeding categories:', seedCatErr.message);
    else console.log('Successfully seeded categories!');
  }

  // Check articles
  const { data: existingArticles, error: artErr } = await supabase.from('articles').select('*').limit(1);
  if (artErr) {
    console.error('Articles Table Error:', artErr.message);
    return;
  }

  console.log('Articles table exists!');

  const { data: currentArticles } = await supabase.from('articles').select('id');
  if (!currentArticles || currentArticles.length === 0) {
    console.log('Seeding Sample Articles...');
    // Get category ID for latest news
    const { data: catList } = await supabase.from('categories').select('id, name');
    const latestCat = catList?.find(c => c.name === 'Latest News')?.id || catList?.[0]?.id;
    
    const articlesToInsert = sampleArticles.map(a => ({
      ...a,
      category_id: latestCat
    }));

    const { error: insertErr } = await supabase.from('articles').insert(articlesToInsert);
    if (insertErr) console.error('Error seeding articles:', insertErr.message);
    else console.log('Successfully seeded 6 sample Telugu news articles!');
  } else {
    console.log(`Database already has ${currentArticles.length} articles.`);
  }
}

seedData();

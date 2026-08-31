-- News records expire seven days after publication. This migration also removes
-- their uploaded images from the `news-images` Storage bucket.
-- Run with `supabase db push` or paste this file into the Supabase SQL Editor.

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS image_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS is_expiring BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.breaking_news
  ADD COLUMN IF NOT EXISTS image_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS is_expiring BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.sidebar_ads
  ADD COLUMN IF NOT EXISTS image_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS is_expiring BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Preserve cleanup for images uploaded before image_storage_path was added.
UPDATE public.articles
SET image_storage_path = regexp_replace(
  image_url,
  '^.*?/storage/v1/object/public/news-images/',
  ''
)
WHERE image_storage_path IS NULL
  AND image_url LIKE '%/storage/v1/object/public/news-images/%';

UPDATE public.breaking_news
SET expires_at = created_at + INTERVAL '7 days'
WHERE is_expiring = true
  AND expires_at IS NULL;

UPDATE public.sidebar_ads
SET expires_at = created_at + INTERVAL '7 days'
WHERE is_expiring = true
  AND expires_at IS NULL;

-- Existing articles receive the same seven-day lifetime. E-paper is maintained
-- separately and must remain available until the administrator replaces it.
UPDATE public.articles
SET is_expiring = false,
    expires_at = NULL
WHERE title IN ('DAILY_EPAPER', 'Daily E-Paper');

UPDATE public.articles
SET expires_at = created_at + INTERVAL '7 days'
WHERE is_expiring = true
  AND expires_at IS NULL;

ALTER TABLE public.articles
  ALTER COLUMN expires_at SET DEFAULT (timezone('utc'::text, now()) + INTERVAL '7 days');

ALTER TABLE public.breaking_news
  ALTER COLUMN expires_at SET DEFAULT (timezone('utc'::text, now()) + INTERVAL '7 days');

ALTER TABLE public.sidebar_ads
  ALTER COLUMN expires_at SET DEFAULT (timezone('utc'::text, now()) + INTERVAL '7 days');

CREATE INDEX IF NOT EXISTS articles_expiry_index
  ON public.articles (expires_at)
  WHERE is_expiring = true;

CREATE INDEX IF NOT EXISTS breaking_news_expiry_index
  ON public.breaking_news (expires_at)
  WHERE is_expiring = true;

CREATE INDEX IF NOT EXISTS sidebar_ads_expiry_index
  ON public.sidebar_ads (expires_at)
  WHERE is_expiring = true;

-- NOTE: Direct SQL deletes from storage.objects are blocked by Supabase Storage.
-- Image cleanup is handled from the application using the Storage API instead.
DROP TRIGGER IF EXISTS articles_remove_replaced_image ON public.articles;
DROP TRIGGER IF EXISTS articles_remove_deleted_image ON public.articles;
DROP TRIGGER IF EXISTS breaking_news_remove_deleted_image ON public.breaking_news;
DROP TRIGGER IF EXISTS sidebar_ads_remove_deleted_image ON public.sidebar_ads;

DROP FUNCTION IF EXISTS public.remove_article_storage_image();
DROP FUNCTION IF EXISTS public.remove_content_storage_image();

CREATE OR REPLACE FUNCTION public.purge_expired_articles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.articles
  WHERE is_expiring = true
    AND expires_at <= timezone('utc'::text, now());
END;
$$;

CREATE OR REPLACE FUNCTION public.purge_expired_breaking_news()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.breaking_news
  WHERE is_expiring = true
    AND expires_at <= timezone('utc'::text, now());
END;
$$;

CREATE OR REPLACE FUNCTION public.purge_expired_sidebar_ads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.sidebar_ads
  WHERE is_expiring = true
    AND expires_at <= timezone('utc'::text, now());
END;
$$;

CREATE OR REPLACE FUNCTION public.purge_expired_content()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.purge_expired_articles();
  PERFORM public.purge_expired_breaking_news();
  PERFORM public.purge_expired_sidebar_ads();
END;
$$;

-- Supabase enables pg_cron for scheduled database jobs. The job runs hourly;
-- website queries also hide an item as soon as its expiry time is reached.
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-expired-content-hourly') THEN
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'purge-expired-content-hourly';
  END IF;

  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-expired-news-hourly') THEN
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'purge-expired-news-hourly';
  END IF;

  PERFORM cron.schedule(
    'purge-expired-content-hourly',
    '15 * * * *',
    'SELECT public.purge_expired_content();'
  );
END;
$$;

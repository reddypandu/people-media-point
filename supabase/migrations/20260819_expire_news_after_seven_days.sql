-- News records expire seven days after publication. This migration also removes
-- their uploaded images from the `news-images` Storage bucket.
-- Run with `supabase db push` or paste this file into the Supabase SQL Editor.

ALTER TABLE public.articles
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

CREATE INDEX IF NOT EXISTS articles_expiry_index
  ON public.articles (expires_at)
  WHERE is_expiring = true;

-- Delete a previous image when an editor replaces it, and delete the final
-- uploaded image when the article is manually deleted or automatically expires.
CREATE OR REPLACE FUNCTION public.remove_article_storage_image()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  IF OLD.image_storage_path IS NOT NULL
     AND (TG_OP = 'DELETE' OR OLD.image_storage_path IS DISTINCT FROM NEW.image_storage_path) THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'news-images'
      AND name = OLD.image_storage_path;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS articles_remove_replaced_image ON public.articles;
CREATE TRIGGER articles_remove_replaced_image
AFTER UPDATE OF image_storage_path ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.remove_article_storage_image();

DROP TRIGGER IF EXISTS articles_remove_deleted_image ON public.articles;
CREATE TRIGGER articles_remove_deleted_image
AFTER DELETE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.remove_article_storage_image();

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

-- Supabase enables pg_cron for scheduled database jobs. The job runs hourly;
-- website queries also hide an article as soon as its expiry time is reached.
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-expired-news-hourly') THEN
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'purge-expired-news-hourly';
  END IF;

  PERFORM cron.schedule(
    'purge-expired-news-hourly',
    '15 * * * *',
    'SELECT public.purge_expired_articles();'
  );
END;
$$;

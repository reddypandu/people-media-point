-- Run in the Supabase SQL Editor. It allows this site's current browser-based
-- admin uploader to add images to the existing `news-images` bucket.
-- The website presently uses a local admin login as well as Supabase Auth, so
-- this policy is intentionally scoped only to this one bucket.

INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "news_images_public_read" ON storage.objects;
CREATE POLICY "news_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

DROP POLICY IF EXISTS "news_images_browser_upload" ON storage.objects;
CREATE POLICY "news_images_browser_upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'news-images');

-- =============================================
-- STORAGE: resume bucket (public read, admin write)
-- Run after 001–003. Safe to re-run (idempotent).
-- =============================================

-- Create a public bucket for resume PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('resume', 'resume', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Anyone can read files in the resume bucket (needed for public download links)
DROP POLICY IF EXISTS "Public read resume bucket" ON storage.objects;
CREATE POLICY "Public read resume bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resume');

-- Authenticated admin can upload
DROP POLICY IF EXISTS "Authenticated upload resume bucket" ON storage.objects;
CREATE POLICY "Authenticated upload resume bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resume' AND auth.role() = 'authenticated');

-- Authenticated admin can update
DROP POLICY IF EXISTS "Authenticated update resume bucket" ON storage.objects;
CREATE POLICY "Authenticated update resume bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'resume' AND auth.role() = 'authenticated');

-- Authenticated admin can delete
DROP POLICY IF EXISTS "Authenticated delete resume bucket" ON storage.objects;
CREATE POLICY "Authenticated delete resume bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'resume' AND auth.role() = 'authenticated');

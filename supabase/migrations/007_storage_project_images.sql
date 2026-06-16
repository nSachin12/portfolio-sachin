-- =============================================
-- STORAGE: project-images bucket (public read, admin write)
-- Run after 001–006. Safe to re-run (idempotent).
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read project images bucket" ON storage.objects;
CREATE POLICY "Public read project images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated upload project images bucket" ON storage.objects;
CREATE POLICY "Authenticated upload project images bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update project images bucket" ON storage.objects;
CREATE POLICY "Authenticated update project images bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete project images bucket" ON storage.objects;
CREATE POLICY "Authenticated delete project images bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

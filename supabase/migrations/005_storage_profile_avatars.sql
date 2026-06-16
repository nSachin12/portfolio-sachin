-- =============================================
-- STORAGE: profile-avatars bucket (public read, admin write)
-- Run after 001–004. Safe to re-run (idempotent).
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-avatars', 'profile-avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read profile avatars bucket" ON storage.objects;
CREATE POLICY "Public read profile avatars bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-avatars');

DROP POLICY IF EXISTS "Authenticated upload profile avatars bucket" ON storage.objects;
CREATE POLICY "Authenticated upload profile avatars bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update profile avatars bucket" ON storage.objects;
CREATE POLICY "Authenticated update profile avatars bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete profile avatars bucket" ON storage.objects;
CREATE POLICY "Authenticated delete profile avatars bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-avatars' AND auth.role() = 'authenticated');
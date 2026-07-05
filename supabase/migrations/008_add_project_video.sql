-- =============================================
-- PROJECTS: add optional public video link
-- Run after 001–007. Safe to re-run (idempotent).
-- =============================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS video_url TEXT;

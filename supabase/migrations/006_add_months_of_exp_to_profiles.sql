-- =============================================
-- PROFILES: add months_of_exp for partial experience duration
-- Safe to re-run.
-- =============================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS months_of_exp INTEGER NOT NULL DEFAULT 0;

UPDATE profiles
SET months_of_exp = 0
WHERE months_of_exp IS NULL;

NOTIFY pgrst, 'reload schema';
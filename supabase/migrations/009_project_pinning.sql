-- =============================================
-- PROJECTS: pinning
-- order_index is now OPTIONAL. A number = "pinned" to that position
-- (lower shows first). NULL = unpinned (sorts after all pinned projects).
-- Run after 001–008. Safe to re-run (idempotent).
-- =============================================

ALTER TABLE projects ALTER COLUMN order_index DROP DEFAULT;
ALTER TABLE projects ALTER COLUMN order_index DROP NOT NULL;

-- Existing rows defaulted to 0 (unpinned) — convert those to NULL so they
-- sort last instead of all fighting for position 0.
UPDATE projects SET order_index = NULL WHERE order_index = 0;

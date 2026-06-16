-- =============================================
-- PORTFOLIO PLATFORM — INITIAL SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name       TEXT NOT NULL DEFAULT 'Nadimidoddi Sachin',
  title           TEXT NOT NULL DEFAULT 'AI Automation Engineer',
  tagline         TEXT,
  bio             TEXT,
  location        TEXT,
  email           TEXT,
  phone           TEXT,
  avatar_url      TEXT,
  availability    TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'open')),
  years_of_exp    INTEGER NOT NULL DEFAULT 0,
  months_of_exp   INTEGER NOT NULL DEFAULT 0,
  github_url      TEXT,
  linkedin_url    TEXT,
  twitter_url     TEXT,
  website_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- PROJECTS
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT NOT NULL,
  overview        TEXT,
  problem         TEXT,
  solution        TEXT,
  architecture    TEXT,
  results         TEXT,
  image_url       TEXT,
  screenshots     JSONB NOT NULL DEFAULT '[]',
  category        TEXT,
  technologies    TEXT[] NOT NULL DEFAULT '{}',
  github_url      TEXT,
  live_url        TEXT,
  featured        BOOLEAN NOT NULL DEFAULT false,
  published       BOOLEAN NOT NULL DEFAULT true,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects(featured);
CREATE INDEX IF NOT EXISTS projects_published_idx ON projects(published);

-- =============================================
-- SKILLS
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  proficiency     INTEGER NOT NULL DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon            TEXT,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS skills_category_idx ON skills(category);

-- =============================================
-- EXPERIENCE
-- =============================================
CREATE TABLE IF NOT EXISTS experience (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company         TEXT NOT NULL,
  role            TEXT NOT NULL,
  description     TEXT,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  technologies    TEXT[] NOT NULL DEFAULT '{}',
  company_logo    TEXT,
  company_url     TEXT,
  location        TEXT,
  start_date      DATE NOT NULL,
  end_date        DATE,
  is_current      BOOLEAN NOT NULL DEFAULT false,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- CERTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS certifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  issuer          TEXT NOT NULL,
  description     TEXT,
  issue_date      DATE,
  expiry_date     DATE,
  credential_id   TEXT,
  credential_url  TEXT,
  certificate_url TEXT,
  image_url       TEXT,
  skills          TEXT[] NOT NULL DEFAULT '{}',
  featured        BOOLEAN NOT NULL DEFAULT false,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- ACHIEVEMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL CHECK (category IN ('Award', 'Competition', 'Internship', 'Recognition', 'Publication')),
  date            DATE,
  organization    TEXT,
  image_url       TEXT,
  url             TEXT,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- BLOGS
-- =============================================
CREATE TABLE IF NOT EXISTS blogs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  cover_image_url TEXT,
  category        TEXT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  reading_time    INTEGER NOT NULL DEFAULT 5,
  views           INTEGER NOT NULL DEFAULT 0,
  published       BOOLEAN NOT NULL DEFAULT false,
  meta_title      TEXT,
  meta_description TEXT,
  og_image_url    TEXT,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);
CREATE INDEX IF NOT EXISTS blogs_published_idx ON blogs(published);
CREATE INDEX IF NOT EXISTS blogs_published_at_idx ON blogs(published_at DESC);

-- =============================================
-- TESTIMONIALS
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  role            TEXT,
  company         TEXT,
  avatar_url      TEXT,
  content         TEXT NOT NULL,
  rating          INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  linkedin_url    TEXT,
  featured        BOOLEAN NOT NULL DEFAULT false,
  published       BOOLEAN NOT NULL DEFAULT true,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- SOCIAL LINKS
-- =============================================
CREATE TABLE IF NOT EXISTS social_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform        TEXT NOT NULL,
  url             TEXT NOT NULL,
  icon            TEXT,
  display_name    TEXT,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- CONTACT MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  company         TEXT,
  role            TEXT,
  message         TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT false,
  replied_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_is_read_idx ON contact_messages(is_read);

-- =============================================
-- RECRUITER LEADS
-- =============================================
CREATE TABLE IF NOT EXISTS recruiter_leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  company         TEXT,
  email           TEXT NOT NULL,
  role            TEXT,
  message         TEXT,
  source          TEXT NOT NULL DEFAULT 'contact' CHECK (source IN ('contact', 'hire_me', 'chat')),
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed')),
  is_read         BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recruiter_leads_status_idx ON recruiter_leads(status);
CREATE INDEX IF NOT EXISTS recruiter_leads_is_read_idx ON recruiter_leads(is_read);

-- =============================================
-- RESUME
-- =============================================
CREATE TABLE IF NOT EXISTS resume (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url        TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  version         TEXT,
  download_count  INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key             TEXT UNIQUE NOT NULL,
  value           TEXT,
  type            TEXT NOT NULL DEFAULT 'string' CHECK (type IN ('string', 'boolean', 'json', 'number')),
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- PAGE VIEWS (analytics)
-- =============================================
CREATE TABLE IF NOT EXISTS page_views (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page            TEXT NOT NULL,
  referrer        TEXT,
  country         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_views_page_idx ON page_views(page);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at DESC);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

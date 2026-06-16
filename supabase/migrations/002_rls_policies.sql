-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience        ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_leads   ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume            ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views        ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC READ POLICIES (portfolio visitors)
-- =============================================

-- Profiles: public can read
CREATE POLICY "Public can read profiles"
  ON profiles FOR SELECT
  USING (true);

-- Projects: public can read published
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT
  USING (published = true);

-- Skills: public can read all
CREATE POLICY "Public can read skills"
  ON skills FOR SELECT
  USING (true);

-- Experience: public can read all
CREATE POLICY "Public can read experience"
  ON experience FOR SELECT
  USING (true);

-- Certifications: public can read all
CREATE POLICY "Public can read certifications"
  ON certifications FOR SELECT
  USING (true);

-- Achievements: public can read all
CREATE POLICY "Public can read achievements"
  ON achievements FOR SELECT
  USING (true);

-- Blogs: public can read published
CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT
  USING (published = true);

-- Testimonials: public can read published
CREATE POLICY "Public can read published testimonials"
  ON testimonials FOR SELECT
  USING (published = true);

-- Social links: public can read all
CREATE POLICY "Public can read social links"
  ON social_links FOR SELECT
  USING (true);

-- Resume: public can read active
CREATE POLICY "Public can read active resume"
  ON resume FOR SELECT
  USING (is_active = true);

-- Settings: public can read all
CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (true);

-- =============================================
-- PUBLIC WRITE POLICIES (form submissions)
-- =============================================

-- Contact messages: anyone can insert
CREATE POLICY "Anyone can submit contact message"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Recruiter leads: anyone can insert
CREATE POLICY "Anyone can submit recruiter lead"
  ON recruiter_leads FOR INSERT
  WITH CHECK (true);

-- Page views: anyone can insert
CREATE POLICY "Anyone can track page view"
  ON page_views FOR INSERT
  WITH CHECK (true);

-- =============================================
-- ADMIN POLICIES (authenticated owner only)
-- =============================================

-- Profiles: owner full access
CREATE POLICY "Admin full access to profiles"
  ON profiles FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Projects: admin full access
CREATE POLICY "Admin full access to projects"
  ON projects FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Skills: admin full access
CREATE POLICY "Admin full access to skills"
  ON skills FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Experience: admin full access
CREATE POLICY "Admin full access to experience"
  ON experience FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Certifications: admin full access
CREATE POLICY "Admin full access to certifications"
  ON certifications FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Achievements: admin full access
CREATE POLICY "Admin full access to achievements"
  ON achievements FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Blogs: admin full access (including unpublished)
CREATE POLICY "Admin full access to blogs"
  ON blogs FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Testimonials: admin full access
CREATE POLICY "Admin full access to testimonials"
  ON testimonials FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Social links: admin full access
CREATE POLICY "Admin full access to social links"
  ON social_links FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Contact messages: admin can read/update
CREATE POLICY "Admin can manage contact messages"
  ON contact_messages FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Recruiter leads: admin can manage
CREATE POLICY "Admin can manage recruiter leads"
  ON recruiter_leads FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Resume: admin full access
CREATE POLICY "Admin full access to resume"
  ON resume FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Settings: admin full access
CREATE POLICY "Admin full access to settings"
  ON settings FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Page views: admin can read
CREATE POLICY "Admin can read page views"
  ON page_views FOR SELECT
  USING (auth.uid() IS NOT NULL);

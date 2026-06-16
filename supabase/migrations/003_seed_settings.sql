-- =============================================
-- SEED: DEFAULT SETTINGS
-- =============================================

INSERT INTO settings (key, value, type, description) VALUES
  ('site_title',            'Nadimidoddi Sachin — AI Automation Engineer', 'string',  'Browser tab title'),
  ('site_description',      'AI Automation Engineer specializing in intelligent systems, workflow automation, and scalable AI solutions.', 'string', 'Meta description'),
  ('hire_me_available',     'true',   'boolean', 'Show availability badge on hero'),
  ('show_blog',             'true',   'boolean', 'Show blog section in nav'),
  ('show_testimonials',     'true',   'boolean', 'Show testimonials section'),
  ('show_chat',             'true',   'boolean', 'Show AI chat widget'),
  ('projects_per_page',     '9',      'number',  'Projects per page on listing'),
  ('blogs_per_page',        '6',      'number',  'Blogs per page on listing'),
  ('maintenance_mode',      'false',  'boolean', 'Put site in maintenance mode'),
  ('og_image',              '/og.png','string',  'Default Open Graph image')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- SEED: DEFAULT SOCIAL LINKS
-- =============================================

INSERT INTO social_links (platform, url, icon, display_name, order_index) VALUES
  ('github',   'https://github.com',   'github',   'GitHub',   1),
  ('linkedin', 'https://linkedin.com', 'linkedin', 'LinkedIn', 2)
ON CONFLICT DO NOTHING;

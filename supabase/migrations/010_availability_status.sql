INSERT INTO settings (key, value, type, description) VALUES
  ('availability_status', 'open_to_opportunities', 'string', 'Professional availability status')
ON CONFLICT (key) DO NOTHING;

UPDATE settings
SET description = CASE key
  WHEN 'show_blog' THEN 'Show the blog in public navigation and allow public access'
  WHEN 'show_testimonials' THEN 'Show testimonials on the public site and allow public access'
  WHEN 'show_chat' THEN 'Show the portfolio assistant on public pages'
END
WHERE key IN ('show_blog', 'show_testimonials', 'show_chat');
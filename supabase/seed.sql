-- Seed categories and 10 digital products

INSERT INTO categories (id, name, slug, icon, sort_order) VALUES
  ('a1000000-0000-4000-8000-000000000001', 'Mockups', 'mockups', 'image', 1),
  ('a1000000-0000-4000-8000-000000000002', 'Presets', 'presets', 'sparkles', 2),
  ('a1000000-0000-4000-8000-000000000003', 'Plantillas', 'plantillas', 'layout-template', 3),
  ('a1000000-0000-4000-8000-000000000004', 'Vectores', 'vectores', 'pen-tool', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  id, name, slug, description, short_description, price, category_id,
  thumbnail_path, preview_images, tags, is_featured, is_bestseller,
  discount_percent, rating, review_count
) VALUES
  (
    'b1000000-0000-4000-8000-000000000001',
    'Luxe Style Mockup Pack',
    'luxe-style-mockup-pack',
    'Premium device mockups with iridescent lighting effects. Includes 24 PSD files optimized for social media and portfolio showcases.',
    '24 premium PSD mockups with futuristic aesthetics.',
    59.90,
    'a1000000-0000-4000-8000-000000000001',
    'products/luxe-style.jpg',
    '["products/luxe-style-1.jpg","products/luxe-style-2.jpg"]'::jsonb,
    ARRAY['mockup', 'psd', 'premium'],
    TRUE, TRUE, NULL, 4.8, 3200
  ),
  (
    'b1000000-0000-4000-8000-000000000002',
    'Neon Brand Kit Mockups',
    'neon-brand-kit-mockups',
    'Complete brand presentation kit with neon-accented stationery, packaging, and digital screen mockups.',
    'Brand kit mockups with neon accents.',
    49.90,
    'a1000000-0000-4000-8000-000000000001',
    'products/neon-brand.jpg',
    '["products/neon-brand-1.jpg"]'::jsonb,
    ARRAY['mockup', 'branding'],
    FALSE, TRUE, 10, 4.7, 1800
  ),
  (
    'b1000000-0000-4000-8000-000000000003',
    'Minimal Device Frames',
    'minimal-device-frames',
    'Clean, minimal device frames for iPhone, iPad, and MacBook. Perfect for app and web design presentations.',
    'Minimal device frames for presentations.',
    29.90,
    'a1000000-0000-4000-8000-000000000001',
    'products/minimal-device.jpg',
    '[]'::jsonb,
    ARRAY['mockup', 'minimal'],
    FALSE, FALSE, NULL, 4.6, 950
  ),
  (
    'b1000000-0000-4000-8000-000000000004',
    'Cyber Glow Lightroom Presets',
    'cyber-glow-lightroom-presets',
    '15 Lightroom presets inspired by cyberpunk and neon aesthetics. One-click color grading for portraits and landscapes.',
    '15 cyberpunk-inspired Lightroom presets.',
    24.90,
    'a1000000-0000-4000-8000-000000000002',
    'products/cyber-glow.jpg',
    '[]'::jsonb,
    ARRAY['presets', 'lightroom'],
    TRUE, FALSE, NULL, 4.9, 2100
  ),
  (
    'b1000000-0000-4000-8000-000000000005',
    'Pastel Dream Preset Bundle',
    'pastel-dream-preset-bundle',
    'Soft pastel tones for Instagram-ready photography. Includes mobile and desktop preset versions.',
    'Soft pastel presets for social media.',
    19.90,
    'a1000000-0000-4000-8000-000000000002',
    'products/pastel-dream.jpg',
    '[]'::jsonb,
    ARRAY['presets', 'pastel'],
    FALSE, TRUE, NULL, 4.8, 1500
  ),
  (
    'b1000000-0000-4000-8000-000000000006',
    'Dark Mode UI Kit',
    'dark-mode-ui-kit',
    'Figma UI kit with 120+ components, auto-layout, and dark mode variants. Ideal for SaaS and dashboard projects.',
    '120+ Figma components with dark mode.',
    39.90,
    'a1000000-0000-4000-8000-000000000003',
    'products/dark-ui-kit.jpg',
    '[]'::jsonb,
    ARRAY['figma', 'ui-kit'],
    TRUE, TRUE, NULL, 4.9, 4200
  ),
  (
    'b1000000-0000-4000-8000-000000000007',
    'Social Media Template Pack',
    'social-media-template-pack',
    '50 editable Canva and PSD templates for Instagram, TikTok, and LinkedIn. Includes story and post formats.',
    '50 social media templates for all platforms.',
    34.90,
    'a1000000-0000-4000-8000-000000000003',
    'products/social-templates.jpg',
    '[]'::jsonb,
    ARRAY['templates', 'social'],
    FALSE, FALSE, 15, 4.7, 890
  ),
  (
    'b1000000-0000-4000-8000-000000000008',
    'Portfolio Presentation Deck',
    'portfolio-presentation-deck',
    'Professional PowerPoint and Keynote deck for designers. 30 slides with animations and editable charts.',
    '30-slide portfolio presentation deck.',
    27.90,
    'a1000000-0000-4000-8000-000000000003',
    'products/portfolio-deck.jpg',
    '[]'::jsonb,
    ARRAY['templates', 'portfolio'],
    FALSE, FALSE, NULL, 4.5, 620
  ),
  (
    'b1000000-0000-4000-8000-000000000009',
    'Abstract Gradient Vectors',
    'abstract-gradient-vectors',
    '100+ scalable SVG and AI abstract gradient shapes. Royalty-free for commercial use.',
    '100+ abstract gradient vector shapes.',
    22.90,
    'a1000000-0000-4000-8000-000000000004',
    'products/abstract-vectors.jpg',
    '[]'::jsonb,
    ARRAY['vectors', 'abstract'],
    FALSE, TRUE, NULL, 4.8, 1100
  ),
  (
    'b1000000-0000-4000-8000-000000000010',
    'Icon Set Pro — Line Edition',
    'icon-set-pro-line-edition',
    '500 minimalist line icons in SVG, PNG, and Figma formats. Organized by category with consistent 24px grid.',
    '500 minimalist line icons in multiple formats.',
    18.90,
    'a1000000-0000-4000-8000-000000000004',
    'products/icon-set.jpg',
    '[]'::jsonb,
    ARRAY['vectors', 'icons'],
    TRUE, FALSE, NULL, 4.9, 2800
  )
ON CONFLICT (slug) DO NOTHING;

-- Placeholder product files (upload real files to digital-assets bucket)
INSERT INTO product_files (product_id, storage_path, file_name, file_size, mime_type) VALUES
  ('b1000000-0000-4000-8000-000000000001', 'luxe-style/luxe-style-pack.zip', 'luxe-style-pack.zip', 52428800, 'application/zip'),
  ('b1000000-0000-4000-8000-000000000002', 'neon-brand/neon-brand-kit.zip', 'neon-brand-kit.zip', 41943040, 'application/zip'),
  ('b1000000-0000-4000-8000-000000000003', 'minimal-device/minimal-frames.zip', 'minimal-frames.zip', 20971520, 'application/zip'),
  ('b1000000-0000-4000-8000-000000000004', 'cyber-glow/cyber-glow-presets.zip', 'cyber-glow-presets.zip', 10485760, 'application/zip'),
  ('b1000000-0000-4000-8000-000000000005', 'pastel-dream/pastel-dream.zip', 'pastel-dream.zip', 8388608, 'application/zip'),
  ('b1000000-0000-4000-8000-000000000006', 'dark-ui-kit/dark-ui-kit.fig', 'dark-ui-kit.fig', 31457280, 'application/octet-stream'),
  ('b1000000-0000-4000-8000-000000000007', 'social-templates/social-pack.zip', 'social-pack.zip', 36700160, 'application/zip'),
  ('b1000000-0000-4000-8000-000000000008', 'portfolio-deck/portfolio-deck.zip', 'portfolio-deck.zip', 25165824, 'application/zip'),
  ('b1000000-0000-4000-8000-000000000009', 'abstract-vectors/abstract-vectors.zip', 'abstract-vectors.zip', 15728640, 'application/zip'),
  ('b1000000-0000-4000-8000-000000000010', 'icon-set/icon-set-pro.zip', 'icon-set-pro.zip', 12582912, 'application/zip');

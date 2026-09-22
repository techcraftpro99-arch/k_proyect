-- Bilingual fields for products and categories (ES default + EN)

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS name_en TEXT;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS short_description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;

COMMENT ON COLUMN categories.name_en IS 'English display name (optional; falls back to name)';
COMMENT ON COLUMN products.name_en IS 'English product name';
COMMENT ON COLUMN products.short_description_en IS 'English short description';
COMMENT ON COLUMN products.description_en IS 'English full description';

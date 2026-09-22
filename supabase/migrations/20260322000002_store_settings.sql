-- Store settings (singleton row for brand assets, etc.)

CREATE TABLE IF NOT EXISTS store_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_image_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO store_settings (id, brand_image_path)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

DROP TRIGGER IF EXISTS store_settings_updated_at ON store_settings;
CREATE TRIGGER store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read store_settings" ON store_settings;
CREATE POLICY "Public read store_settings"
  ON store_settings FOR SELECT
  USING (TRUE);

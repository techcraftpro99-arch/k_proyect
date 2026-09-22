-- Add per-product external PayPal payment link
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS payment_link TEXT;

COMMENT ON COLUMN products.payment_link IS
  'External PayPal checkout URL for this product (e.g. paypal.me or PayPal.me link)';

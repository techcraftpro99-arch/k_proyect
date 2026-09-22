-- Categorías y productos reales de Karol (ejecutar DESPUÉS de la migración)

INSERT INTO categories (id, name, slug, icon, sort_order) VALUES
  ('a1000000-0000-4000-8000-000000000001', 'Insignias', 'insignias', 'sparkles', 1),
  ('a1000000-0000-4000-8000-000000000005', 'Regalos TikTok', 'regalos-tiktok', 'gift', 2),
  ('a1000000-0000-4000-8000-000000000002', 'Mockups', 'mockups', 'image', 3),
  ('a1000000-0000-4000-8000-000000000003', 'Plantillas', 'plantillas', 'layout-template', 4),
  ('a1000000-0000-4000-8000-000000000004', 'Vectores', 'vectores', 'pen-tool', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  id, name, slug, description, short_description, price, category_id,
  thumbnail_path, preview_images, tags, is_featured, is_bestseller,
  discount_percent, rating, review_count
) VALUES
  (
    'b1000000-0000-4000-8000-000000000001',
    'INSIGNIAS #1 (Sin números)',
    'insignias-1-sin-numeros',
    E'💖 Insignias #1 (No Numeradas)\n\nIncluye:\n✔️ Insignias de Miembro.\n✔️ Insignias de Donador.\n✔️ Barras de progreso estáticas (sin animación).\n\n📦 Entrega en formato PNG transparente y en alta calidad.\n\nPerfectas para:\n✨ Flyers promocionales.\n✨ Miniaturas.\n✨ Videos de presentación.\n✨ Diseños para redes sociales.\n✨ Paneles y material visual para tu comunidad.',
    'Pack de insignias de miembro y donador + barras de progreso estáticas. PNG transparente en alta calidad.',
    10.00,
    'a1000000-0000-4000-8000-000000000001',
    '/images/products/insignias-1-cover.png',
    '["/images/products/insignias-1-cover.png","/images/products/insignias-1-preview-1.png","/images/products/insignias-1-preview-2.png"]'::jsonb,
    ARRAY['insignias', 'tiktok', 'miembro', 'donador', 'png'],
    TRUE, TRUE, NULL, 5.0, 48
  ),
  (
    'b1000000-0000-4000-8000-000000000011',
    'INSIGNIAS #2 (Con Números)',
    'insignias-2-con-numeros',
    E'Paquete completo de insignias numeradas para sistemas de membresía y donación.\n\nIncluye:\n✔️ Miembro Nivel 1 al 50.\n✔️ Donador Nivel 1 al 50.\n✔️ Diseños numerados listos para usar.\n\n📦 Entrega en formato PNG transparente y en alta calidad.\n\nPerfectas para:\n✨ Sistemas de rangos.\n✨ Reconocimiento de miembros.\n✨ Diseños de comunidad.\n✨ Flyers y contenido promocional.',
    'Insignias numeradas de miembro y donador (nivel 1–50). PNG transparente en alta calidad.',
    10.00,
    'a1000000-0000-4000-8000-000000000001',
    '/images/products/insignias-2-cover.jpg',
    '["/images/products/insignias-2-cover.jpg","/images/products/insignias-2-preview-1.jpg"]'::jsonb,
    ARRAY['insignias', 'tiktok', 'miembro', 'donador', 'numeradas', 'png'],
    TRUE, TRUE, NULL, 5.0, 36
  ),
  (
    'b1000000-0000-4000-8000-000000000012',
    'REGALOS DE TIKTOK',
    'regalos-de-tiktok',
    E'Colección de regalos inspirados en algunos de los efectos y regalos más populares de TikTok Live.\n\n📦 Entrega en formato PNG transparente y en alta calidad.\n\nPerfectos para:\n✨ Flyers promocionales.\n✨ Diseños para eventos.\n✨ Videos temáticos.\n✨ Miniaturas.\n✨ Recursos visuales para comunidades y agencias.\n\n✅ Archivos digitales listos para usar.\n✅ PNG transparente en alta calidad (excepto animaciones MOV).\n✅ Diseño profesional.\n✅ Ideal para TikTok Live, agencias, streamers y creadores de contenido.',
    'Colección de regalos inspirados en TikTok Live. PNG transparente en alta calidad, listos para usar.',
    15.00,
    'a1000000-0000-4000-8000-000000000005',
    '/images/products/regalos-tiktok-cover.jpg',
    '["/images/products/regalos-tiktok-cover.jpg","/images/products/regalos-tiktok-preview-1.jpg","/images/products/regalos-tiktok-preview-2.jpg","/images/products/regalos-tiktok-preview-3.jpg","/images/products/regalos-tiktok-preview-4.jpg"]'::jsonb,
    ARRAY['regalos', 'tiktok', 'live', 'streamers', 'png'],
    TRUE, TRUE, NULL, 5.0, 52
  )
ON CONFLICT (slug) DO NOTHING;

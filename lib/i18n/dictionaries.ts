export type Locale = "en" | "es";

export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "es";

export const dictionaries = {
  en: {
    nav: {
      home: "Home",
      shop: "Shop",
      about: "About me",
      sale: "Sale",
      contact: "Contact",
      search: "Search",
      favorites: "Favorites",
      cart: "Cart",
      account: "Account",
      brand: "Designer's Blog",
    },
    about: {
      eyebrow: "Meet Karol",
      title: "Hi, I'm Karol",
      lead: "I create MVP animations, dedications, flyers, and battle-ready motion for your next official battle",
      highlight: "Let's make your live stand out!",
      body: "I design visual moments that hit hard on stream: entrances, dedications, promotional flyers, and battle animations with energy, clarity, and that premium feel your audience remembers.",
      servicesTitle: "What I create",
      services: {
        mvp: {
          title: "MVP Animations",
          desc: "Impactful intros and highlights so your best moments look like a main event.",
        },
        dedications: {
          title: "Dedications",
          desc: "Emotional, stylish dedications made for gifts, shoutouts, and unforgettable lives.",
        },
        flyers: {
          title: "Flyers & Promos",
          desc: "Clean, scroll-stopping artwork for events, battles, collabs, and announcements.",
        },
        battles: {
          title: "Battle Animations",
          desc: "Motion packs for official battles — entrances, counters, wins, and hype sequences.",
        },
      },
      ctaShop: "Browse digital packs",
      ctaContact: "Work with me",
      note: "Need something custom for your next live? Tell me the vibe and I'll bring it to life.",
    },
    search: {
      headline: "Search Your Perfect Assets",
      placeholder: "Search mockups, presets, badges...",
      button: "Search",
    },
    shop: {
      title: "Shop",
      featured: "Featured Products",
      byCategory: "Shop By Category",
      allProducts: "All Products",
      featuredItems: "Featured Items",
      featuredLink: "Featured",
      bestSelling: "Best Selling",
      onDiscounts: "On Discounts",
      categories: "Categories",
      noProducts: "No products found",
      noProductsHint: "Try adjusting your search or category filter.",
      catalogUnavailable: "Store temporarily unavailable",
      catalogUnavailableHint:
        "We couldn't connect to the catalog. Please try again in a few minutes.",
      emptyHero: "No featured products",
    },
    product: {
      reviews: "Reviews",
      addToCart: "Add To Cart",
      buyNow: "Buy Now",
      featured: "Featured",
      bestseller: "Bestseller",
      save: "Save",
      viewDetail: "View details",
      buyNowShort: "Buy now",
      prev: "Previous product",
      next: "Next product",
    },
    checkout: {
      title: "Checkout",
      empty: "Your cart is empty",
      browse: "Browse Products",
      contactInfo: "Contact Information",
      email: "Email *",
      name: "Name (optional)",
      namePlaceholder: "Your name",
      paymentMethod: "Payment Method",
      paypal: "PayPal",
      whatsapp: "WhatsApp",
      tiktok: "TikTok",
      continuePaypal: "Continue to PayPal",
      payWithPaypal: "Pay with PayPal",
      payProduct: "Pay {name} with PayPal",
      paypalLinkHint:
        "You'll be redirected to the product's PayPal payment link. After paying, we'll email your downloads once the order is approved.",
      payOneAtATime:
        "Each product has its own PayPal link. Pay one product at a time.",
      noPaymentLink: "This product has no PayPal payment link configured.",
      missingLink: "No payment link",
      creatingOrder: "Creating order...",
      processing: "Processing payment...",
      payWhatsapp: "Pay via WhatsApp",
      payTiktok: "Pay via TikTok",
      orderSummary: "Order Summary",
      total: "Total",
      emailRequired: "Please enter your email",
      emailBeforePay: "Please enter your email before paying",
      checkoutFailed: "Checkout failed",
      captureFailed: "Payment capture failed",
      whatsappHint:
        "Send your payment proof via WhatsApp. Your download links will be emailed once approved.",
      tiktokHint:
        "Contact us on TikTok with your payment proof. Downloads are sent after manual verification.",
      openWhatsapp: "Open WhatsApp",
      openTiktok: "Open TikTok",
      orderId: "Order ID",
      emailLabel: "Email",
      totalLabel: "Total",
      paypalNotConfigured:
        "PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment.",
    },
    success: {
      orderReceived: "Order Received!",
      paymentSuccessful: "Payment Successful!",
      orderId: "Order ID",
      manualHint:
        "Once your payment is verified, download links will be sent to your email within 24 hours.",
      paidHint: "Check your email for download links. Links expire in 24 hours.",
      continue: "Continue Shopping",
    },
    footer: {
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      support: "Support",
    },
    lang: {
      en: "EN",
      es: "ES",
      label: "Language",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      shop: "Tienda",
      about: "Sobre mí",
      sale: "Ofertas",
      contact: "Contacto",
      search: "Buscar",
      favorites: "Favoritos",
      cart: "Carrito",
      account: "Cuenta",
      brand: "Blog de la diseñadora",
    },
    about: {
      eyebrow: "Conoce a Karol",
      title: "Hola, soy Karol",
      lead: "Hago animaciones de MVP, dedicatorias, flyers y animaciones para tu próxima batalla oficial",
      highlight: "¡Hagamos que tu live destaque!",
      body: "Creo momentos visuales que se sienten potentes en stream: entradas, dedicatorias, flyers promocionales y animaciones de batalla con energía, claridad y ese toque premium que tu audiencia recuerda.",
      servicesTitle: "Qué creo",
      services: {
        mvp: {
          title: "Animaciones MVP",
          desc: "Intros e highlights con impacto para que tus mejores momentos parezcan evento principal.",
        },
        dedications: {
          title: "Dedicatorias",
          desc: "Dedicatorias con estilo y emoción, ideales para regalos, shoutouts y lives inolvidables.",
        },
        flyers: {
          title: "Flyers y promos",
          desc: "Arte limpio y llamativo para eventos, batallas, collabs y anuncios.",
        },
        battles: {
          title: "Animaciones de batalla",
          desc: "Packs de motion para batallas oficiales: entradas, counters, wins y secuencias de hype.",
        },
      },
      ctaShop: "Ver packs digitales",
      ctaContact: "Trabajemos juntos",
      note: "¿Necesitas algo custom para tu próximo live? Cuéntame la vibra y lo hacemos realidad.",
    },
    search: {
      headline: "Busca tus recursos ideales",
      placeholder: "Buscar mockups, presets, insignias...",
      button: "Buscar",
    },
    shop: {
      title: "Tienda",
      featured: "Productos destacados",
      byCategory: "Comprar por categoría",
      allProducts: "Todos los productos",
      featuredItems: "Destacados",
      featuredLink: "Destacados",
      bestSelling: "Más vendidos",
      onDiscounts: "En descuento",
      categories: "Categorías",
      noProducts: "No se encontraron productos",
      noProductsHint: "Prueba cambiando la búsqueda o la categoría.",
      catalogUnavailable: "Tienda temporalmente no disponible",
      catalogUnavailableHint:
        "No pudimos conectar con el catálogo. Intenta de nuevo en unos minutos.",
      emptyHero: "No hay productos destacados",
    },
    product: {
      reviews: "reseñas",
      addToCart: "Añadir al carrito",
      buyNow: "Comprar ahora",
      featured: "Destacado",
      bestseller: "Más vendido",
      save: "Ahorra",
      viewDetail: "Ver detalle",
      buyNowShort: "Comprar ahora",
      prev: "Producto anterior",
      next: "Siguiente producto",
    },
    checkout: {
      title: "Checkout",
      empty: "Tu carrito está vacío",
      browse: "Ver productos",
      contactInfo: "Información de contacto",
      email: "Email *",
      name: "Nombre (opcional)",
      namePlaceholder: "Tu nombre",
      paymentMethod: "Método de pago",
      paypal: "PayPal",
      whatsapp: "WhatsApp",
      tiktok: "TikTok",
      continuePaypal: "Continuar con PayPal",
      payWithPaypal: "Pagar con PayPal",
      payProduct: "Pagar {name} con PayPal",
      paypalLinkHint:
        "Te redirigiremos al link de PayPal de este producto. Cuando pagues, te enviaremos los archivos por email al aprobar el pedido.",
      payOneAtATime:
        "Cada producto tiene su propio link de PayPal. Paga un producto a la vez.",
      noPaymentLink: "Este producto no tiene link de pago PayPal configurado.",
      missingLink: "Sin link de pago",
      creatingOrder: "Creando orden...",
      processing: "Procesando pago...",
      payWhatsapp: "Pagar por WhatsApp",
      payTiktok: "Pagar por TikTok",
      orderSummary: "Resumen del pedido",
      total: "Total",
      emailRequired: "Ingresa tu email",
      emailBeforePay: "Ingresa tu email antes de pagar",
      checkoutFailed: "Error en el checkout",
      captureFailed: "Error al capturar el pago",
      whatsappHint:
        "Envía el comprobante por WhatsApp. Te mandaremos los enlaces de descarga por email cuando se apruebe.",
      tiktokHint:
        "Contáctanos en TikTok con tu comprobante. Los enlaces se envían tras la verificación manual.",
      openWhatsapp: "Abrir WhatsApp",
      openTiktok: "Abrir TikTok",
      orderId: "Orden",
      emailLabel: "Email",
      totalLabel: "Total",
      paypalNotConfigured:
        "PayPal no está configurado. Define NEXT_PUBLIC_PAYPAL_CLIENT_ID en tu entorno.",
    },
    success: {
      orderReceived: "¡Pedido recibido!",
      paymentSuccessful: "¡Pago exitoso!",
      orderId: "ID de orden",
      manualHint:
        "Cuando verifiquemos tu pago, te enviaremos los enlaces de descarga al email en menos de 24 horas.",
      paidHint:
        "Revisa tu email para los enlaces de descarga. Caducan en 24 horas.",
      continue: "Seguir comprando",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      privacy: "Privacidad",
      terms: "Términos",
      support: "Soporte",
    },
    lang: {
      en: "EN",
      es: "ES",
      label: "Idioma",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

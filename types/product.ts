export interface Category {
  id: string;
  name: string;
  /** English name (optional) */
  nameEn: string | null;
  slug: string;
  icon: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  description: string;
  descriptionEn: string | null;
  shortDescription: string;
  shortDescriptionEn: string | null;
  price: number;
  category: Category;
  thumbnailUrl: string;
  previewImages: string[];
  tags: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  discountPercent: number | null;
  rating: number;
  reviewCount: number;
  /** External PayPal payment URL for this product */
  paymentLink: string | null;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "rating";
  featured?: boolean;
  bestseller?: boolean;
  limit?: number;
  offset?: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  thumbnailUrl: string;
  quantity: 1;
}

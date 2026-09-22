export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";
export type PaymentMethod = "paypal" | "whatsapp" | "tiktok";

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          name_en: string | null;
          slug: string;
          icon: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_en?: string | null;
          slug: string;
          icon?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_en?: string | null;
          slug?: string;
          icon?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          name_en: string | null;
          slug: string;
          description: string;
          description_en: string | null;
          short_description: string;
          short_description_en: string | null;
          price: number;
          category_id: string;
          thumbnail_path: string;
          preview_images: Json;
          tags: string[];
          is_featured: boolean;
          is_bestseller: boolean;
          discount_percent: number | null;
          rating: number;
          review_count: number;
          payment_link: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_en?: string | null;
          slug: string;
          description?: string;
          description_en?: string | null;
          short_description?: string;
          short_description_en?: string | null;
          price: number;
          category_id: string;
          thumbnail_path?: string;
          preview_images?: Json;
          tags?: string[];
          is_featured?: boolean;
          is_bestseller?: boolean;
          discount_percent?: number | null;
          rating?: number;
          review_count?: number;
          payment_link?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_en?: string | null;
          slug?: string;
          description?: string;
          description_en?: string | null;
          short_description?: string;
          short_description_en?: string | null;
          price?: number;
          category_id?: string;
          thumbnail_path?: string;
          preview_images?: Json;
          tags?: string[];
          is_featured?: boolean;
          is_bestseller?: boolean;
          discount_percent?: number | null;
          rating?: number;
          review_count?: number;
          payment_link?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_files: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          file_name: string;
          file_size?: number;
          mime_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          file_name?: string;
          file_size?: number;
          mime_type?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_files_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          email: string;
          customer_name: string | null;
          status: OrderStatus;
          payment_method: PaymentMethod;
          payment_reference: string | null;
          paypal_order_id: string | null;
          total: number;
          created_at: string;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          customer_name?: string | null;
          status?: OrderStatus;
          payment_method: PaymentMethod;
          payment_reference?: string | null;
          paypal_order_id?: string | null;
          total: number;
          created_at?: string;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          customer_name?: string | null;
          status?: OrderStatus;
          payment_method?: PaymentMethod;
          payment_reference?: string | null;
          paypal_order_id?: string | null;
          total?: number;
          created_at?: string;
          paid_at?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          price_at_purchase: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          price_at_purchase: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          price_at_purchase?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      download_tokens: {
        Row: {
          id: string;
          order_id: string;
          product_file_id: string;
          token: string;
          expires_at: string;
          downloaded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_file_id: string;
          token?: string;
          expires_at: string;
          downloaded_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_file_id?: string;
          token?: string;
          expires_at?: string;
          downloaded_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "download_tokens_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "download_tokens_product_file_id_fkey";
            columns: ["product_file_id"];
            isOneToOne: false;
            referencedRelation: "product_files";
            referencedColumns: ["id"];
          },
        ];
      };
      store_settings: {
        Row: {
          id: number;
          brand_image_path: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          brand_image_path?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          brand_image_path?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      payment_method: PaymentMethod;
    };
    CompositeTypes: Record<string, never>;
  };
};

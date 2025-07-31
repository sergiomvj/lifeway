export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      apis_externas: {
        Row: {
          chave: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          chave: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          chave?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          franchise_id: string | null
          id: number
          is_featured_candidate: boolean | null
          old_articles: boolean | null
          published_at: string | null
          relevance_score: number | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          franchise_id?: string | null
          id?: never
          is_featured_candidate?: boolean | null
          old_articles?: boolean | null
          published_at?: string | null
          relevance_score?: number | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          franchise_id?: string | null
          id?: never
          is_featured_candidate?: boolean | null
          old_articles?: boolean | null
          published_at?: string | null
          relevance_score?: number | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string | null
          tag_id: string | null
        }
        Insert: {
          post_id?: string | null
          tag_id?: string | null
        }
        Update: {
          post_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string
          category_id: string | null
          created_at: string | null
          id: string
          image_url: string | null
          published: boolean | null
          published_at: string | null
          read_time: number | null
          slug: string
          summary: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body: string
          category_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          body?: string
          category_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          average_temperature: Json | null
          business_opportunity_score: number | null
          composite_score: number | null
          cost_of_living_index: number | null
          country: string
          description: string | null
          education_score: number | null
          id: string
          image_url: string | null
          job_market_score: number | null
          main_destiny: boolean | null
          name: string
          population: number | null
          slogan: string | null
          state: string
        }
        Insert: {
          average_temperature?: Json | null
          business_opportunity_score?: number | null
          composite_score?: number | null
          cost_of_living_index?: number | null
          country: string
          description?: string | null
          education_score?: number | null
          id?: string
          image_url?: string | null
          job_market_score?: number | null
          main_destiny?: boolean | null
          name: string
          population?: number | null
          slogan?: string | null
          state: string
        }
        Update: {
          average_temperature?: Json | null
          business_opportunity_score?: number | null
          composite_score?: number | null
          cost_of_living_index?: number | null
          country?: string
          description?: string | null
          education_score?: number | null
          id?: string
          image_url?: string | null
          job_market_score?: number | null
          main_destiny?: boolean | null
          name?: string
          population?: number | null
          slogan?: string | null
          state?: string
        }
        Relationships: []
      }
      cities_images: {
        Row: {
          city_id: string
          id: number
        }
        Insert: {
          city_id: string
          id?: number
        }
        Update: {
          city_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cities_images_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: true
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa: {
        Row: {
          cidade: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          facebook: string | null
          id: number
          instagram: string | null
          linkedin: string | null
          nome: string | null
          slogan: string | null
          whatsapp: string | null
          x: string | null
          youtube: string | null
          zip: string | null
        }
        Insert: {
          cidade?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          linkedin?: string | null
          nome?: string | null
          slogan?: string | null
          whatsapp?: string | null
          x?: string | null
          youtube?: string | null
          zip?: string | null
        }
        Update: {
          cidade?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          linkedin?: string | null
          nome?: string | null
          slogan?: string | null
          whatsapp?: string | null
          x?: string | null
          youtube?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      english_courses: {
        Row: {
          address: string | null
          city_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          address?: string | null
          city_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          address?: string | null
          city_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      multistep_forms: {
        Row: {
          created_at: string | null
          data: Json | null
          form_data: Json | null
          id: string
          is_completed: boolean | null
          qualify: boolean | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          form_data?: Json | null
          id?: string
          is_completed?: boolean | null
          qualify?: boolean | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          form_data?: Json | null
          id?: string
          is_completed?: boolean | null
          qualify?: boolean | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_courses: {
        Row: {
          address: string | null
          city_id: string | null
          created_at: string | null
          description: string | null
          field: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          address?: string | null
          city_id?: string | null
          created_at?: string | null
          description?: string | null
          field?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          address?: string | null
          city_id?: string | null
          created_at?: string | null
          description?: string | null
          field?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          downloaded_guide: boolean | null
          follows_instagram: boolean | null
          full_name: string | null
          id: string
          joined_whatsapp: boolean | null
          qualify: boolean | null
          received_guide: boolean | null
          role: string | null
          user_role: string | null
        }
        Insert: {
          birth_date?: string | null
          downloaded_guide?: boolean | null
          follows_instagram?: boolean | null
          full_name?: string | null
          id: string
          joined_whatsapp?: boolean | null
          qualify?: boolean | null
          received_guide?: boolean | null
          role?: string | null
          user_role?: string | null
        }
        Update: {
          birth_date?: string | null
          downloaded_guide?: boolean | null
          follows_instagram?: boolean | null
          full_name?: string | null
          id?: string
          joined_whatsapp?: boolean | null
          qualify?: boolean | null
          received_guide?: boolean | null
          role?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      prospects: {
        Row: {
          analise_familyplanner: string | null
          analise_getopportunity: string | null
          analise_visamatch: string | null
          id: string
          plano_projectusa_output: string | null
          pro: boolean | null
          qualify: boolean | null
          simulador_entrevista_output: string | null
          user_id: string | null
        }
        Insert: {
          analise_familyplanner?: string | null
          analise_getopportunity?: string | null
          analise_visamatch?: string | null
          id?: string
          plano_projectusa_output?: string | null
          pro?: boolean | null
          qualify?: boolean | null
          simulador_entrevista_output?: string | null
          user_id?: string | null
        }
        Update: {
          analise_familyplanner?: string | null
          analise_getopportunity?: string | null
          analise_visamatch?: string | null
          id?: string
          plano_projectusa_output?: string | null
          pro?: boolean | null
          qualify?: boolean | null
          simulador_entrevista_output?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          city_id: string | null
          created_at: string | null
          has_kindergarten: boolean | null
          has_pre_kindergarten: boolean | null
          id: string
          name: string
          phone: string | null
          type: string | null
          updated_at: string | null
          url: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city_id?: string | null
          created_at?: string | null
          has_kindergarten?: boolean | null
          has_pre_kindergarten?: boolean | null
          id?: string
          name: string
          phone?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city_id?: string | null
          created_at?: string | null
          has_kindergarten?: boolean | null
          has_pre_kindergarten?: boolean | null
          id?: string
          name?: string
          phone?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      universities: {
        Row: {
          campus_id: string | null
          campus_name: string | null
          city_id: string | null
          created_at: string | null
          f1_certified: boolean | null
          id: string
          m1_certified: boolean | null
          name: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          campus_id?: string | null
          campus_name?: string | null
          city_id?: string | null
          created_at?: string | null
          f1_certified?: boolean | null
          id?: string
          m1_certified?: boolean | null
          name: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          campus_id?: string | null
          campus_name?: string | null
          city_id?: string | null
          created_at?: string | null
          f1_certified?: boolean | null
          id?: string
          m1_certified?: boolean | null
          name?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

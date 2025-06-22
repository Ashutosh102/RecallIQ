export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string
          id: string
          insight_type: string
          relevance_score: number | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description: string
          id?: string
          insight_type: string
          relevance_score?: number | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string
          id?: string
          insight_type?: string
          relevance_score?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          action_type: string
          created_at: string | null
          credits_remaining: number
          credits_used: number
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          credits_remaining: number
          credits_used: number
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          credits_remaining?: number
          credits_used?: number
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verification_otps: {
        Row: {
          attempts: number | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          otp_code: string
          verified: boolean | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          otp_code: string
          verified?: boolean | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      freemium_usage: {
        Row: {
          ai_searches: number | null
          created_at: string | null
          id: string
          memory_saves: number | null
          memory_saves_with_media: number | null
          month_year: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_searches?: number | null
          created_at?: string | null
          id?: string
          memory_saves?: number | null
          memory_saves_with_media?: number | null
          month_year: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_searches?: number | null
          created_at?: string | null
          id?: string
          memory_saves?: number | null
          memory_saves_with_media?: number | null
          month_year?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "freemium_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          ai_enhanced: boolean | null
          ai_insights: Json | null
          content: string | null
          created_at: string | null
          date: string
          id: string
          location: string | null
          people: string[] | null
          summary: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_enhanced?: boolean | null
          ai_insights?: Json | null
          content?: string | null
          created_at?: string | null
          date?: string
          id?: string
          location?: string | null
          people?: string[] | null
          summary: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_enhanced?: boolean | null
          ai_insights?: Json | null
          content?: string | null
          created_at?: string | null
          date?: string
          id?: string
          location?: string | null
          people?: string[] | null
          summary?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      memory_attachments: {
        Row: {
          created_at: string | null
          extracted_text: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          memory_id: string
          processed_at: string | null
          processing_status: string | null
          transcription: string | null
        }
        Insert: {
          created_at?: string | null
          extracted_text?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          memory_id: string
          processed_at?: string | null
          processing_status?: string | null
          transcription?: string | null
        }
        Update: {
          created_at?: string | null
          extracted_text?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          memory_id?: string
          processed_at?: string | null
          processing_status?: string | null
          transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_attachments_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          credits: number | null
          first_name: string | null
          id: string
          is_premium: boolean | null
          joined_at: string | null
          last_name: string | null
          preferences: Json | null
          premium_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          first_name?: string | null
          id: string
          is_premium?: boolean | null
          joined_at?: string | null
          last_name?: string | null
          preferences?: Json | null
          premium_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          first_name?: string | null
          id?: string
          is_premium?: boolean | null
          joined_at?: string | null
          last_name?: string | null
          preferences?: Json | null
          premium_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          p_user_id: string
          p_credits_to_add: number
          p_description?: string
        }
        Returns: Json
      }
      check_and_update_premium_status: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_otps_secure: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_email_verification_otp: {
        Args: { p_email: string }
        Returns: string
      }
      deduct_credits: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_credits_to_deduct: number
          p_description?: string
        }
        Returns: Json
      }
      generate_otp: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      verify_email_otp: {
        Args: { p_email: string; p_otp: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

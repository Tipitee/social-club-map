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
      clubs: {
        Row: {
          additional_info: string | null
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          district: string | null
          latitude: number | null
          longitude: number | null
          membership_status: boolean | null
          name: string
          postal_code: string | null
          status: string | null
          website: string | null
        }
        Insert: {
          additional_info?: string | null
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          latitude?: number | null
          longitude?: number | null
          membership_status?: boolean | null
          name: string
          postal_code?: string | null
          status?: string | null
          website?: string | null
        }
        Update: {
          additional_info?: string | null
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          latitude?: number | null
          longitude?: number | null
          membership_status?: boolean | null
          name?: string
          postal_code?: string | null
          status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          activity: string
          created_at: string | null
          date: string
          dosage: string
          dosage_type: string
          effectiveness: number
          id: string
          mood: string
          notes: string | null
          side_effects: string[]
          user_id: string
        }
        Insert: {
          activity: string
          created_at?: string | null
          date: string
          dosage: string
          dosage_type: string
          effectiveness: number
          id?: string
          mood: string
          notes?: string | null
          side_effects: string[]
          user_id: string
        }
        Update: {
          activity?: string
          created_at?: string | null
          date?: string
          dosage?: string
          dosage_type?: string
          effectiveness?: number
          id?: string
          mood?: string
          notes?: string | null
          side_effects?: string[]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          language: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          language?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          language?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      strains: {
        Row: {
          description: string | null
          effects_json: string | null
          highest_percent: string | null
          img_url: string | null
          most_common_terpene: string | null
          name: string
          new_column_name: string | null
          second_effect: string | null
          second_percent: string | null
          terpenes_json: string | null
          thc_level: number | null
          third_effect: string | null
          third_percent: string | null
          top_effect: string | null
          type: string | null
          unique_identifier: string | null
        }
        Insert: {
          description?: string | null
          effects_json?: string | null
          highest_percent?: string | null
          img_url?: string | null
          most_common_terpene?: string | null
          name?: string
          new_column_name?: string | null
          second_effect?: string | null
          second_percent?: string | null
          terpenes_json?: string | null
          thc_level?: number | null
          third_effect?: string | null
          third_percent?: string | null
          top_effect?: string | null
          type?: string | null
          unique_identifier?: string | null
        }
        Update: {
          description?: string | null
          effects_json?: string | null
          highest_percent?: string | null
          img_url?: string | null
          most_common_terpene?: string | null
          name?: string
          new_column_name?: string | null
          second_effect?: string | null
          second_percent?: string | null
          terpenes_json?: string | null
          thc_level?: number | null
          third_effect?: string | null
          third_percent?: string | null
          top_effect?: string | null
          type?: string | null
          unique_identifier?: string | null
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

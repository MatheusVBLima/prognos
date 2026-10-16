// Generated from the Supabase schema; regenerate after each migration
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      brand_kits: {
        Row: {
          audience_summary: string | null
          body_font: string
          colors: Json
          created_at: string
          heading_font: string
          id: string
          keywords: string[]
          logo_url: string | null
          project_id: string
          source: string
          tone_of_voice: string | null
          updated_at: string
          user_id: string
          value_proposition: string | null
          voice_traits: string[]
          website_snapshot: Json | null
        }
        Insert: {
          audience_summary?: string | null
          body_font?: string
          colors?: Json
          created_at?: string
          heading_font?: string
          id?: string
          keywords?: string[]
          logo_url?: string | null
          project_id: string
          source: string
          tone_of_voice?: string | null
          updated_at?: string
          user_id?: string
          value_proposition?: string | null
          voice_traits?: string[]
          website_snapshot?: Json | null
        }
        Update: {
          audience_summary?: string | null
          body_font?: string
          colors?: Json
          created_at?: string
          heading_font?: string
          id?: string
          keywords?: string[]
          logo_url?: string | null
          project_id?: string
          source?: string
          tone_of_voice?: string | null
          updated_at?: string
          user_id?: string
          value_proposition?: string | null
          voice_traits?: string[]
          website_snapshot?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_kits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords: {
        Row: {
          active: boolean
          created_at: string
          id: string
          project_id: string
          source: string
          term: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          project_id: string
          source?: string
          term: string
          user_id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          project_id?: string
          source?: string
          term?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "keywords_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          audience: string | null
          country: string | null
          created_at: string
          description: string
          goals: string | null
          id: string
          language: string
          name: string
          niche: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          audience?: string | null
          country?: string | null
          created_at?: string
          description: string
          goals?: string | null
          id?: string
          language?: string
          name: string
          niche?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Update: {
          audience?: string | null
          country?: string | null
          created_at?: string
          description?: string
          goals?: string | null
          id?: string
          language?: string
          name?: string
          niche?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      trend_ideas: {
        Row: {
          competition: number
          created_at: string
          evidence: Json
          fit: number
          formats: string[]
          hooks: string[]
          id: string
          interest: Json
          keywords: string[]
          momentum: number
          platforms: string[]
          project_id: string
          run_id: string | null
          score: number
          status: string
          summary: string
          title: string
          updated_at: string
          user_id: string
          why_now: string
        }
        Insert: {
          competition: number
          created_at?: string
          evidence?: Json
          fit: number
          formats?: string[]
          hooks?: string[]
          id?: string
          interest?: Json
          keywords?: string[]
          momentum: number
          platforms?: string[]
          project_id: string
          run_id?: string | null
          score: number
          status?: string
          summary: string
          title: string
          updated_at?: string
          user_id?: string
          why_now: string
        }
        Update: {
          competition?: number
          created_at?: string
          evidence?: Json
          fit?: number
          formats?: string[]
          hooks?: string[]
          id?: string
          interest?: Json
          keywords?: string[]
          momentum?: number
          platforms?: string[]
          project_id?: string
          run_id?: string | null
          score?: number
          status?: string
          summary?: string
          title?: string
          updated_at?: string
          user_id?: string
          why_now?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_ideas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trend_ideas_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "trend_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_runs: {
        Row: {
          error: string | null
          finished_at: string | null
          id: string
          project_id: string
          sources: string[]
          started_at: string
          status: string
          trigger: string
          user_id: string
        }
        Insert: {
          error?: string | null
          finished_at?: string | null
          id?: string
          project_id: string
          sources?: string[]
          started_at?: string
          status?: string
          trigger: string
          user_id?: string
        }
        Update: {
          error?: string | null
          finished_at?: string | null
          id?: string
          project_id?: string
          sources?: string[]
          started_at?: string
          status?: string
          trigger?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_signals: {
        Row: {
          collected_at: string
          id: string
          keyword: string
          payload: Json
          project_id: string
          region: string | null
          run_id: string | null
          source: string
          user_id: string
        }
        Insert: {
          collected_at?: string
          id?: string
          keyword: string
          payload: Json
          project_id: string
          region?: string | null
          run_id?: string | null
          source: string
          user_id?: string
        }
        Update: {
          collected_at?: string
          id?: string
          keyword?: string
          payload?: Json
          project_id?: string
          region?: string | null
          run_id?: string | null
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_signals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trend_signals_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "trend_runs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_project: { Args: { target: string }; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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

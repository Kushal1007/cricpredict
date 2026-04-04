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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
          message: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      ball_events: {
        Row: {
          ball_number: number
          batsman: string | null
          bowler: string | null
          commentary: string | null
          created_at: string
          event_type: string
          id: string
          match_id: string
          over_number: number
          runs: number
        }
        Insert: {
          ball_number: number
          batsman?: string | null
          bowler?: string | null
          commentary?: string | null
          created_at?: string
          event_type?: string
          id?: string
          match_id: string
          over_number: number
          runs?: number
        }
        Update: {
          ball_number?: number
          batsman?: string | null
          bowler?: string | null
          commentary?: string | null
          created_at?: string
          event_type?: string
          id?: string
          match_id?: string
          over_number?: number
          runs?: number
        }
        Relationships: [
          {
            foreignKeyName: "ball_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["match_id"]
          },
        ]
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          ref_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          ref_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          ref_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_bonus_claims: {
        Row: {
          claimed_at: string
          coins_given: number
          id: string
          streak_day: number
          user_id: string
        }
        Insert: {
          claimed_at?: string
          coins_given?: number
          id?: string
          streak_day?: number
          user_id: string
        }
        Update: {
          claimed_at?: string
          coins_given?: number
          id?: string
          streak_day?: number
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          batting_team: string | null
          created_at: string
          id: string
          last_synced_at: string | null
          match_id: string
          match_type: string | null
          overs: string | null
          raw_data: Json | null
          result: string | null
          run_rate: number | null
          score1: string | null
          score2: string | null
          start_time: string | null
          status: string
          team1: string
          team1_img: string | null
          team1_short: string
          team2: string
          team2_img: string | null
          team2_short: string
          toss_decision: string | null
          toss_winner: string | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          batting_team?: string | null
          created_at?: string
          id?: string
          last_synced_at?: string | null
          match_id: string
          match_type?: string | null
          overs?: string | null
          raw_data?: Json | null
          result?: string | null
          run_rate?: number | null
          score1?: string | null
          score2?: string | null
          start_time?: string | null
          status?: string
          team1: string
          team1_img?: string | null
          team1_short?: string
          team2: string
          team2_img?: string | null
          team2_short?: string
          toss_decision?: string | null
          toss_winner?: string | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          batting_team?: string | null
          created_at?: string
          id?: string
          last_synced_at?: string | null
          match_id?: string
          match_type?: string | null
          overs?: string | null
          raw_data?: Json | null
          result?: string | null
          run_rate?: number | null
          score1?: string | null
          score2?: string | null
          start_time?: string | null
          status?: string
          team1?: string
          team1_img?: string | null
          team1_short?: string
          team2?: string
          team2_img?: string | null
          team2_short?: string
          toss_decision?: string | null
          toss_winner?: string | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      predictions: {
        Row: {
          coins_won: number | null
          cost_paid: number
          created_at: string
          id: string
          match_id: string
          option_id: string
          option_label: string
          phase: string
          potential_win: number
          question_id: string
          question_text: string
          resolved_at: string | null
          result: string
          user_id: string
        }
        Insert: {
          coins_won?: number | null
          cost_paid: number
          created_at?: string
          id?: string
          match_id: string
          option_id: string
          option_label: string
          phase: string
          potential_win: number
          question_id: string
          question_text: string
          resolved_at?: string | null
          result?: string
          user_id: string
        }
        Update: {
          coins_won?: number | null
          cost_paid?: number
          created_at?: string
          id?: string
          match_id?: string
          option_id?: string
          option_label?: string
          phase?: string
          potential_win?: number
          question_id?: string
          question_text?: string
          resolved_at?: string | null
          result?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          best_streak: number
          coins: number
          correct_predictions: number
          created_at: string
          email: string
          fav_team_id: string | null
          id: string
          level: number
          level_name: string
          login_streak: number
          matches_played: number
          points: number
          streak: number
          total_predictions: number
          updated_at: string
          username: string
        }
        Insert: {
          best_streak?: number
          coins?: number
          correct_predictions?: number
          created_at?: string
          email: string
          fav_team_id?: string | null
          id: string
          level?: number
          level_name?: string
          login_streak?: number
          matches_played?: number
          points?: number
          streak?: number
          total_predictions?: number
          updated_at?: string
          username: string
        }
        Update: {
          best_streak?: number
          coins?: number
          correct_predictions?: number
          created_at?: string
          email?: string
          fav_team_id?: string | null
          id?: string
          level?: number
          level_name?: string
          login_streak?: number
          matches_played?: number
          points?: number
          streak?: number
          total_predictions?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          accuracy: number | null
          best_streak: number | null
          coins: number | null
          id: string | null
          level_name: string | null
          points: number | null
          rank: number | null
          streak: number | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      compute_level: {
        Args: { p_points: number }
        Returns: Record<string, unknown>
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

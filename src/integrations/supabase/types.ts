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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alert_preferences: {
        Row: {
          created_at: string | null
          id: string
          notify_entry: boolean | null
          notify_signals: boolean | null
          notify_stop: boolean | null
          notify_target: boolean | null
          token_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notify_entry?: boolean | null
          notify_signals?: boolean | null
          notify_stop?: boolean | null
          notify_target?: boolean | null
          token_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notify_entry?: boolean | null
          notify_signals?: boolean | null
          notify_stop?: boolean | null
          notify_target?: boolean | null
          token_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_preferences_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          created_at: string
          created_by: string | null
          entry_zone: string | null
          id: string
          invalidation: string | null
          risk_reward: string | null
          stop: string | null
          targets: string | null
          token_id: string
          volatility_note: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entry_zone?: string | null
          id?: string
          invalidation?: string | null
          risk_reward?: string | null
          stop?: string | null
          targets?: string | null
          token_id: string
          volatility_note?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entry_zone?: string | null
          id?: string
          invalidation?: string | null
          risk_reward?: string | null
          stop?: string | null
          targets?: string | null
          token_id?: string
          volatility_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      macro_view: {
        Row: {
          btc_trend: string | null
          created_at: string
          cycle_view: string | null
          dominance: string | null
          id: string
          liquidity: string | null
          updated_at: string
          weekly_plan: string | null
        }
        Insert: {
          btc_trend?: string | null
          created_at?: string
          cycle_view?: string | null
          dominance?: string | null
          id?: string
          liquidity?: string | null
          updated_at?: string
          weekly_plan?: string | null
        }
        Update: {
          btc_trend?: string | null
          created_at?: string
          cycle_view?: string | null
          dominance?: string | null
          id?: string
          liquidity?: string | null
          updated_at?: string
          weekly_plan?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          language: string
          plan: Database["public"]["Enums"]["user_plan"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          language?: string
          plan?: Database["public"]["Enums"]["user_plan"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          language?: string
          plan?: Database["public"]["Enums"]["user_plan"]
          updated_at?: string
        }
        Relationships: []
      }
      radar_weekly: {
        Row: {
          accumulation: string | null
          created_at: string
          id: string
          macro_view: string | null
          observation: string | null
          removed: string | null
          trigger_ready: string | null
          week_label: string
        }
        Insert: {
          accumulation?: string | null
          created_at?: string
          id?: string
          macro_view?: string | null
          observation?: string | null
          removed?: string | null
          trigger_ready?: string | null
          week_label: string
        }
        Update: {
          accumulation?: string | null
          created_at?: string
          id?: string
          macro_view?: string | null
          observation?: string | null
          removed?: string | null
          trigger_ready?: string | null
          week_label?: string
        }
        Relationships: []
      }
      token_analysis: {
        Row: {
          adx: number | null
          atr: number | null
          buy_pressure: boolean | null
          buy_score: number | null
          change_24h: number | null
          cloud_position: string | null
          created_at: string | null
          current_price: number | null
          di_minus: number | null
          di_plus: number | null
          ema_100: number | null
          ema_200: number | null
          ema_21: number | null
          ema_50: number | null
          fib_236: number | null
          fib_382: number | null
          fib_500: number | null
          fib_618: number | null
          fib_786: number | null
          fib_zone: string | null
          htf_trend: string | null
          id: string
          key_resistance: number | null
          key_support: number | null
          kijun: number | null
          macd_histogram: number | null
          macd_line: number | null
          macd_signal: number | null
          mtf_trend: string | null
          patterns_detected: Json | null
          risk_reward: number | null
          rsi: number | null
          sell_score: number | null
          senkou_a: number | null
          senkou_b: number | null
          signal: string | null
          stoch_d: number | null
          stoch_k: number | null
          stop_loss: number | null
          supertrend_direction: string | null
          supertrend_value: number | null
          take_profit: number | null
          tenkan: number | null
          ticker: string
          timeframe: string | null
          token_id: string | null
          updated_at: string | null
          volume_ratio: number | null
        }
        Insert: {
          adx?: number | null
          atr?: number | null
          buy_pressure?: boolean | null
          buy_score?: number | null
          change_24h?: number | null
          cloud_position?: string | null
          created_at?: string | null
          current_price?: number | null
          di_minus?: number | null
          di_plus?: number | null
          ema_100?: number | null
          ema_200?: number | null
          ema_21?: number | null
          ema_50?: number | null
          fib_236?: number | null
          fib_382?: number | null
          fib_500?: number | null
          fib_618?: number | null
          fib_786?: number | null
          fib_zone?: string | null
          htf_trend?: string | null
          id?: string
          key_resistance?: number | null
          key_support?: number | null
          kijun?: number | null
          macd_histogram?: number | null
          macd_line?: number | null
          macd_signal?: number | null
          mtf_trend?: string | null
          patterns_detected?: Json | null
          risk_reward?: number | null
          rsi?: number | null
          sell_score?: number | null
          senkou_a?: number | null
          senkou_b?: number | null
          signal?: string | null
          stoch_d?: number | null
          stoch_k?: number | null
          stop_loss?: number | null
          supertrend_direction?: string | null
          supertrend_value?: number | null
          take_profit?: number | null
          tenkan?: number | null
          ticker: string
          timeframe?: string | null
          token_id?: string | null
          updated_at?: string | null
          volume_ratio?: number | null
        }
        Update: {
          adx?: number | null
          atr?: number | null
          buy_pressure?: boolean | null
          buy_score?: number | null
          change_24h?: number | null
          cloud_position?: string | null
          created_at?: string | null
          current_price?: number | null
          di_minus?: number | null
          di_plus?: number | null
          ema_100?: number | null
          ema_200?: number | null
          ema_21?: number | null
          ema_50?: number | null
          fib_236?: number | null
          fib_382?: number | null
          fib_500?: number | null
          fib_618?: number | null
          fib_786?: number | null
          fib_zone?: string | null
          htf_trend?: string | null
          id?: string
          key_resistance?: number | null
          key_support?: number | null
          kijun?: number | null
          macd_histogram?: number | null
          macd_line?: number | null
          macd_signal?: number | null
          mtf_trend?: string | null
          patterns_detected?: Json | null
          risk_reward?: number | null
          rsi?: number | null
          sell_score?: number | null
          senkou_a?: number | null
          senkou_b?: number | null
          signal?: string | null
          stoch_d?: number | null
          stoch_k?: number | null
          stop_loss?: number | null
          supertrend_direction?: string | null
          supertrend_value?: number | null
          take_profit?: number | null
          tenkan?: number | null
          ticker?: string
          timeframe?: string | null
          token_id?: string | null
          updated_at?: string | null
          volume_ratio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "token_analysis_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          change_24h: number | null
          created_at: string
          current_price: number | null
          fdv: number | null
          id: string
          market_cap: number | null
          name: string
          narrative: string | null
          score: number | null
          status: Database["public"]["Enums"]["token_status"]
          structure: string | null
          supply: number | null
          ticker: string
          unlocks: string | null
          updated_at: string
          volume_24h: number | null
        }
        Insert: {
          change_24h?: number | null
          created_at?: string
          current_price?: number | null
          fdv?: number | null
          id?: string
          market_cap?: number | null
          name: string
          narrative?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["token_status"]
          structure?: string | null
          supply?: number | null
          ticker: string
          unlocks?: string | null
          updated_at?: string
          volume_24h?: number | null
        }
        Update: {
          change_24h?: number | null
          created_at?: string
          current_price?: number | null
          fdv?: number | null
          id?: string
          market_cap?: number | null
          name?: string
          narrative?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["token_status"]
          structure?: string | null
          supply?: number | null
          ticker?: string
          unlocks?: string | null
          updated_at?: string
          volume_24h?: number | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
      [_ in never]: never
    }
    Functions: {
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
      token_status: "observacao" | "acumulacao" | "gatilho" | "andamento"
      user_plan: "free" | "pro"
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
      token_status: ["observacao", "acumulacao", "gatilho", "andamento"],
      user_plan: ["free", "pro"],
    },
  },
} as const

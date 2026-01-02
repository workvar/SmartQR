export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_user_id: string;
          email: string;
          created_at: string;
          updated_at: string;
          qr_count: number;
          ai_suggestions_used: number;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          qr_count?: number;
          ai_suggestions_used?: number;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          qr_count?: number;
          ai_suggestions_used?: number;
        };
      };
      qr_codes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          url: string;
          settings: any; // JSONB - QRSettings
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          url: string;
          settings: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          url?: string;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export interface QRCode {
  id: string;
  user_id: string;
  name: string;
  url: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  created_at: string;
  updated_at: string;
  qr_count: number;
  ai_suggestions_used: number;
}


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
          deleted_at: string | null;
          qr_count: number;
          ai_suggestions_used: number;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          qr_count?: number;
          ai_suggestions_used?: number;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
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
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          url: string;
          settings: any;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          url?: string;
          settings?: any;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      dynamic_qr_codes: {
        Row: {
          id: string;
          qr_code_id: string;
          user_id: string;
          unique_id: string;
          destination_url: string;
          created_at: string;
          updated_at: string;
          expires_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          qr_code_id: string;
          user_id: string;
          unique_id: string;
          destination_url: string;
          created_at?: string;
          updated_at?: string;
          expires_at: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          qr_code_id?: string;
          user_id?: string;
          unique_id?: string;
          destination_url?: string;
          created_at?: string;
          updated_at?: string;
          expires_at?: string;
          deleted_at?: string | null;
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
  deleted_at: string | null;
}

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  qr_count: number;
  ai_suggestions_used: number;
}

export interface DynamicQRCode {
  id: string;
  qr_code_id: string;
  user_id: string;
  unique_id: string;
  destination_url: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  deleted_at: string | null;
}


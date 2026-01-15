import { createClient } from '@supabase/supabase-js';

// These environment variables will be provided by Figma Make after Supabase connection
// For now, we use empty strings which will make the client non-functional but won't crash
const supabaseUrl = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL 
  : '';
const supabaseAnonKey = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  : '';

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null as any; // Placeholder when Supabase is not configured

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          employee_id: string;
          company: string;
          role: 'employee' | 'supervisor' | 'admin';
          department?: string;
          security_question?: string;
          security_answer_hash?: string;
          biometric_enrolled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      sites: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          latitude: number;
          longitude: number;
          radius: number;
          supervisor_id?: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sites']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['sites']['Insert']>;
      };
      pairs: {
        Row: {
          id: string;
          employee_a_id: string;
          employee_b_id: string;
          site_id: string;
          start_date: string;
          end_date?: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pairs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['pairs']['Insert']>;
      };
      check_ins: {
        Row: {
          id: string;
          employee_id: string;
          site_id: string;
          pair_id?: string;
          timestamp: string;
          type: 'start' | 'periodic' | 'end';
          verification_method: 'facial' | 'question';
          latitude: number;
          longitude: number;
          status: 'verified' | 'failed' | 'suspicious';
          ai_confidence_score: number;
          pair_present: boolean;
          distance_to_pair?: number;
          photo_url?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['check_ins']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['check_ins']['Insert']>;
      };
      biometric_data: {
        Row: {
          id: string;
          employee_id: string;
          photo_url: string;
          face_encoding: string; // JSON string of face encoding vectors
          enrolled_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['biometric_data']['Row'], 'id' | 'enrolled_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['biometric_data']['Insert']>;
      };
      sessions: {
        Row: {
          id: string;
          employee_id: string;
          site_id: string;
          pair_id?: string;
          start_time: string;
          end_time?: string;
          status: 'present' | 'paused' | 'absent';
          total_duration?: number;
          pair_duration?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      ai_alerts: {
        Row: {
          id: string;
          employee_id: string;
          site_id: string;
          check_in_id?: string;
          alert_type: 'gps_anomaly' | 'face_mismatch' | 'suspicious_pattern' | 'pair_separation';
          severity: 'low' | 'medium' | 'high';
          confidence_score: number;
          message: string;
          resolved: boolean;
          resolved_by?: string;
          created_at: string;
          resolved_at?: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_alerts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_alerts']['Insert']>;
      };
      system_settings: {
        Row: {
          id: string;
          verification_frequency: number; // in minutes
          default_site_radius: number; // in meters
          ai_alert_threshold: number; // confidence percentage
          auto_stop_outside_hours: boolean;
          updated_at: string;
          updated_by?: string;
        };
        Insert: Omit<Database['public']['Tables']['system_settings']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['system_settings']['Insert']>;
      };
    };
  };
}

// SQL Schema for Supabase Migration
export const DATABASE_SCHEMA = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('employee', 'supervisor', 'admin')),
  department TEXT,
  security_question TEXT,
  security_answer_hash TEXT,
  biometric_enrolled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites table
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius INTEGER NOT NULL DEFAULT 100,
  supervisor_id UUID REFERENCES profiles(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pairs table (binômes)
CREATE TABLE IF NOT EXISTS pairs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_a_id UUID REFERENCES profiles(id) NOT NULL,
  employee_b_id UUID REFERENCES profiles(id) NOT NULL,
  site_id UUID REFERENCES sites(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_employees CHECK (employee_a_id != employee_b_id)
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) NOT NULL,
  site_id UUID REFERENCES sites(id) NOT NULL,
  pair_id UUID REFERENCES pairs(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('start', 'periodic', 'end')),
  verification_method TEXT NOT NULL CHECK (verification_method IN ('facial', 'question')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('verified', 'failed', 'suspicious')),
  ai_confidence_score DECIMAL(5, 2) NOT NULL,
  pair_present BOOLEAN NOT NULL,
  distance_to_pair DECIMAL(8, 2),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biometric data table (encrypted storage reference)
CREATE TABLE IF NOT EXISTS biometric_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
  photo_url TEXT NOT NULL,
  face_encoding TEXT NOT NULL, -- JSON string of face vectors
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) NOT NULL,
  site_id UUID REFERENCES sites(id) NOT NULL,
  pair_id UUID REFERENCES pairs(id),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('present', 'paused', 'absent')),
  total_duration INTEGER, -- in minutes
  pair_duration INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Alerts table
CREATE TABLE IF NOT EXISTS ai_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) NOT NULL,
  site_id UUID REFERENCES sites(id) NOT NULL,
  check_in_id UUID REFERENCES check_ins(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('gps_anomaly', 'face_mismatch', 'suspicious_pattern', 'pair_separation')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  confidence_score DECIMAL(5, 2) NOT NULL,
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  verification_frequency INTEGER DEFAULT 90, -- in minutes
  default_site_radius INTEGER DEFAULT 100, -- in meters
  ai_alert_threshold DECIMAL(5, 2) DEFAULT 70.0,
  auto_stop_outside_hours BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_sites_supervisor ON sites(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_pairs_employees ON pairs(employee_a_id, employee_b_id);
CREATE INDEX IF NOT EXISTS idx_pairs_site ON pairs(site_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_employee ON check_ins(employee_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_site ON check_ins(site_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_timestamp ON check_ins(timestamp);
CREATE INDEX IF NOT EXISTS idx_sessions_employee ON sessions(employee_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_ai_alerts_employee ON ai_alerts(employee_id);
CREATE INDEX IF NOT EXISTS idx_ai_alerts_severity ON ai_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_ai_alerts_resolved ON ai_alerts(resolved);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Supervisors can view employees in their sites
CREATE POLICY "Supervisors can view employees" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'supervisor'
  )
);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Sites: Supervisors can manage their sites
CREATE POLICY "Supervisors can manage sites" ON sites FOR ALL USING (
  supervisor_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('supervisor', 'admin'))
);

-- Check-ins: Employees can create their own check-ins
CREATE POLICY "Employees can create check-ins" ON check_ins FOR INSERT WITH CHECK (employee_id = auth.uid());
CREATE POLICY "Users can view check-ins" ON check_ins FOR SELECT USING (
  employee_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('supervisor', 'admin'))
);

-- Biometric data: Only accessible by the employee and admins
CREATE POLICY "Biometric data access" ON biometric_data FOR SELECT USING (
  employee_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- System settings: Only admins can modify
CREATE POLICY "Admins can manage settings" ON system_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pairs_updated_at BEFORE UPDATE ON pairs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_biometric_data_updated_at BEFORE UPDATE ON biometric_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (verification_frequency, default_site_radius, ai_alert_threshold, auto_stop_outside_hours)
VALUES (90, 100, 70.0, TRUE)
ON CONFLICT DO NOTHING;
`;
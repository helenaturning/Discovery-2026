import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthUser extends Profile {
  supabaseUser: SupabaseUser;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't try to use Supabase if it's not configured
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) throw error;

      if (profile) {
        setUser({
          ...profile,
          supabaseUser,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    company: string;
    role: 'employee' | 'supervisor' | 'admin';
    department?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Hash security answer if provided
      let securityAnswerHash = undefined;
      if (data.securityAnswer) {
        // In production, use proper hashing (bcrypt, etc.)
        securityAnswerHash = btoa(data.securityAnswer.toLowerCase().trim());
      }

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        employee_id: data.employeeId,
        company: data.company,
        role: data.role,
        department: data.department,
        security_question: data.securityQuestion,
        security_answer_hash: securityAnswerHash,
        biometric_enrolled: false,
      });

      if (profileError) throw profileError;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const uploadBiometricPhoto = async (userId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/biometric.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('biometric-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('biometric-photos').getPublicUrl(filePath);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const uploadVerificationPhoto = async (userId: string, file: File, checkInId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${checkInId}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('verification-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('verification-photos').getPublicUrl(fileName);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    uploadBiometricPhoto,
    uploadVerificationPhoto,
  };
}
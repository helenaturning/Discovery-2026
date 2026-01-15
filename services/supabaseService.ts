import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  if (!supabase) {
    console.warn('Supabase is not configured. Please set up Supabase credentials.');
    return false;
  }
  return true;
};

type Site = Database['public']['Tables']['sites']['Row'];
type SiteInsert = Database['public']['Tables']['sites']['Insert'];
type Pair = Database['public']['Tables']['pairs']['Row'];
type PairInsert = Database['public']['Tables']['pairs']['Insert'];
type CheckIn = Database['public']['Tables']['check_ins']['Row'];
type CheckInInsert = Database['public']['Tables']['check_ins']['Insert'];
type Session = Database['public']['Tables']['sessions']['Row'];
type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
type AIAlert = Database['public']['Tables']['ai_alerts']['Row'];
type SystemSettings = Database['public']['Tables']['system_settings']['Row'];

// ====== SITES ======
export const sitesService = {
  async getAll() {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getBySupervisor(supervisorId: string) {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('supervisor_id', supervisorId)
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  async create(site: SiteInsert) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('sites')
      .insert(site)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<SiteInsert>) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('sites')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    if (!isSupabaseConfigured()) return;
    
    const { error } = await supabase
      .from('sites')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },
};

// ====== PAIRS ======
export const pairsService = {
  async getAll() {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('pairs')
      .select(`
        *,
        employee_a:profiles!pairs_employee_a_id_fkey(first_name, last_name, employee_id),
        employee_b:profiles!pairs_employee_b_id_fkey(first_name, last_name, employee_id),
        site:sites(name, address)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBySite(siteId: string) {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('pairs')
      .select(`
        *,
        employee_a:profiles!pairs_employee_a_id_fkey(first_name, last_name, employee_id),
        employee_b:profiles!pairs_employee_b_id_fkey(first_name, last_name, employee_id)
      `)
      .eq('site_id', siteId)
      .eq('active', true);

    if (error) throw error;
    return data;
  },

  async getByEmployee(employeeId: string) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('pairs')
      .select(`
        *,
        employee_a:profiles!pairs_employee_a_id_fkey(first_name, last_name, employee_id),
        employee_b:profiles!pairs_employee_b_id_fkey(first_name, last_name, employee_id),
        site:sites(name, address, latitude, longitude, radius)
      `)
      .or(`employee_a_id.eq.${employeeId},employee_b_id.eq.${employeeId}`)
      .eq('active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  async create(pair: PairInsert) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('pairs')
      .insert(pair)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<PairInsert>) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('pairs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    if (!isSupabaseConfigured()) return;
    
    const { error } = await supabase
      .from('pairs')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },
};

// ====== CHECK-INS ======
export const checkInsService = {
  async create(checkIn: CheckInInsert) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('check_ins')
      .insert(checkIn)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getByEmployee(employeeId: string, limit = 50) {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .eq('employee_id', employeeId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getByEmployeeToday(employeeId: string) {
    if (!isSupabaseConfigured()) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .eq('employee_id', employeeId)
      .gte('timestamp', today.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBySite(siteId: string, from?: Date, to?: Date) {
    if (!isSupabaseConfigured()) return [];
    
    let query = supabase
      .from('check_ins')
      .select(`
        *,
        employee:profiles(first_name, last_name, employee_id)
      `)
      .eq('site_id', siteId);

    if (from) query = query.gte('timestamp', from.toISOString());
    if (to) query = query.lte('timestamp', to.toISOString());

    query = query.order('timestamp', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },
};

// ====== SESSIONS ======
export const sessionsService = {
  async create(session: SessionInsert) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<SessionInsert>) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getActiveByEmployee(employeeId: string) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        site:sites(name, address, latitude, longitude, radius),
        pair:pairs(
          employee_a:profiles!pairs_employee_a_id_fkey(first_name, last_name),
          employee_b:profiles!pairs_employee_b_id_fkey(first_name, last_name)
        )
      `)
      .eq('employee_id', employeeId)
      .is('end_time', null)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async endSession(id: string) {
    if (!isSupabaseConfigured()) return null;
    
    const now = new Date();
    
    const { data: session } = await supabase
      .from('sessions')
      .select('start_time')
      .eq('id', id)
      .single();

    if (!session) throw new Error('Session not found');

    const duration = Math.floor((now.getTime() - new Date(session.start_time).getTime()) / 60000); // in minutes

    const { data, error } = await supabase
      .from('sessions')
      .update({
        end_time: now.toISOString(),
        status: 'absent',
        total_duration: duration,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ====== AI ALERTS ======
export const alertsService = {
  async create(alert: Database['public']['Tables']['ai_alerts']['Insert']) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('ai_alerts')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBySite(siteId: string, resolvedOnly = false) {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('ai_alerts')
      .select(`
        *,
        employee:profiles(first_name, last_name, employee_id)
      `)
      .eq('site_id', siteId)
      .eq('resolved', resolvedOnly)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUnresolved() {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('ai_alerts')
      .select(`
        *,
        employee:profiles(first_name, last_name, employee_id),
        site:sites(name)
      `)
      .eq('resolved', false)
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async resolve(id: string, resolvedBy: string) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('ai_alerts')
      .update({
        resolved: true,
        resolved_by: resolvedBy,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ====== SYSTEM SETTINGS ======
export const settingsService = {
  async get() {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  async update(updates: Partial<Database['public']['Tables']['system_settings']['Insert']>, updatedBy: string) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('system_settings')
      .update({ ...updates, updated_by: updatedBy })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ====== BIOMETRIC DATA ======
export const biometricService = {
  async store(employeeId: string, photoUrl: string, faceEncoding: string) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('biometric_data')
      .upsert({
        employee_id: employeeId,
        photo_url: photoUrl,
        face_encoding: faceEncoding,
      })
      .select()
      .single();

    if (error) throw error;

    // Update profile to mark biometric as enrolled
    await supabase
      .from('profiles')
      .update({ biometric_enrolled: true })
      .eq('id', employeeId);

    return data;
  },

  async get(employeeId: string) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('biometric_data')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};

// ====== USERS (PROFILES) ======
export const usersService = {
  async getAll() {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByRole(role: 'employee' | 'supervisor' | 'admin') {
    if (!isSupabaseConfigured()) return [];
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('last_name');

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
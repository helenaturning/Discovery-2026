import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabaseAuth, AuthUser } from '../hooks/useSupabaseAuth';
import { 
  sitesService, 
  pairsService, 
  checkInsService, 
  sessionsService,
  alertsService,
  usersService,
  biometricService 
} from '../services/supabaseService';
import type { Database } from '../lib/supabase';

type Site = Database['public']['Tables']['sites']['Row'];
type Pair = Database['public']['Tables']['pairs']['Row'];
type Session = Database['public']['Tables']['sessions']['Row'];
type CheckIn = Database['public']['Tables']['check_ins']['Row'];
type AIAlert = Database['public']['Tables']['ai_alerts']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ExtendedSession extends Session {
  siteName?: string;
  siteAddress?: string;
  pairName?: string;
  pairStatus?: string;
  distanceToPair?: number;
}

interface AuthContextType {
  // Auth
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  
  // Session
  currentSession: ExtendedSession | null;
  startSession: () => Promise<void>;
  pauseSession: () => Promise<void>;
  endSession: () => Promise<void>;
  
  // Sites
  sites: Site[];
  addSite: (site: Database['public']['Tables']['sites']['Insert']) => Promise<void>;
  updateSite: (id: string, updates: Partial<Database['public']['Tables']['sites']['Update']>) => Promise<void>;
  deleteSite: (id: string) => Promise<void>;
  
  // Pairs
  pairs: Pair[];
  addPair: (pair: Database['public']['Tables']['pairs']['Insert']) => Promise<void>;
  updatePair: (id: string, updates: Partial<Database['public']['Tables']['pairs']['Update']>) => Promise<void>;
  deletePair: (id: string) => Promise<void>;
  
  // Check-ins
  checkIns: CheckIn[];
  addCheckIn: (checkIn: Database['public']['Tables']['check_ins']['Insert']) => Promise<void>;
  
  // Alerts
  alerts: AIAlert[];
  resolveAlert: (id: string) => Promise<void>;
  
  // Users
  allUsers: Profile[];
  refreshUsers: () => Promise<void>;
  
  // Loading states
  loading: boolean;
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, signUp, signIn, signOut, uploadBiometricPhoto, uploadVerificationPhoto } = useSupabaseAuth();
  
  const [currentSession, setCurrentSession] = useState<ExtendedSession | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when user logs in
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Reset state when logged out
      setCurrentSession(null);
      setSites([]);
      setPairs([]);
      setCheckIns([]);
      setAlerts([]);
      setAllUsers([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Load based on role
      if (user.role === 'employee') {
        // Load employee-specific data
        const [activeSession, pair, checkInData] = await Promise.all([
          sessionsService.getActiveByEmployee(user.id),
          pairsService.getByEmployee(user.id),
          checkInsService.getByEmployeeToday(user.id),
        ]);

        if (activeSession) {
          setCurrentSession({
            ...activeSession,
            siteName: activeSession.site?.name,
            siteAddress: activeSession.site?.address,
            pairName: activeSession.pair ? 
              `${activeSession.pair.employee_a.first_name} ${activeSession.pair.employee_a.last_name}` : 
              undefined,
          });
        }

        setCheckIns(checkInData || []);
      } else if (user.role === 'supervisor') {
        // Load supervisor data
        const [siteData, pairData, alertData] = await Promise.all([
          sitesService.getBySupervisor(user.id),
          Promise.all((await sitesService.getBySupervisor(user.id)).map(site => pairsService.getBySite(site.id))).then(results => results.flat()),
          Promise.all((await sitesService.getBySupervisor(user.id)).map(site => alertsService.getBySite(site.id))).then(results => results.flat()),
        ]);

        setSites(siteData || []);
        setPairs(pairData || []);
        setAlerts(alertData || []);
      } else if (user.role === 'admin') {
        // Load admin data
        const [siteData, pairData, alertData, userData] = await Promise.all([
          sitesService.getAll(),
          pairsService.getAll(),
          alertsService.getUnresolved(),
          usersService.getAll(),
        ]);

        setSites(siteData || []);
        setPairs(pairData || []);
        setAlerts(alertData || []);
        setAllUsers(userData || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    return result;
  };

  const logout = async () => {
    await signOut();
  };

  const register = async (userData: any) => {
    const result = await signUp({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      employeeId: userData.employeeId,
      company: userData.company,
      role: userData.role,
      department: userData.department,
      securityQuestion: userData.securityQuestion,
      securityAnswer: userData.securityAnswer,
    });

    // If employee and has biometric photo, upload it
    if (result.success && userData.role === 'employee' && userData.biometricPhoto) {
      // This would be handled in the registration flow
    }

    return result;
  };

  const startSession = async () => {
    if (!user) return;

    try {
      // Get employee's pair
      const pair = await pairsService.getByEmployee(user.id);
      if (!pair) {
        throw new Error('No pair assigned');
      }

      const session = await sessionsService.create({
        employee_id: user.id,
        site_id: pair.site_id,
        pair_id: pair.id,
        status: 'present',
      });

      // Get site details
      const site = await sitesService.getById(pair.site_id);

      setCurrentSession({
        ...session,
        siteName: site.name,
        siteAddress: site.address,
        pairName: `${pair.employee_b.first_name} ${pair.employee_b.last_name}`,
      });

      // Create initial check-in
      await addCheckIn({
        employee_id: user.id,
        site_id: pair.site_id,
        pair_id: pair.id,
        type: 'start',
        verification_method: 'facial',
        latitude: site.latitude,
        longitude: site.longitude,
        status: 'verified',
        ai_confidence_score: 95,
        pair_present: true,
      });
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  };

  const pauseSession = async () => {
    if (!currentSession) return;

    try {
      const updated = await sessionsService.update(currentSession.id, {
        status: 'paused',
      });

      setCurrentSession({ ...currentSession, status: 'paused' });
    } catch (error) {
      console.error('Error pausing session:', error);
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    try {
      await sessionsService.endSession(currentSession.id);
      
      // Create end check-in
      await addCheckIn({
        employee_id: currentSession.employee_id,
        site_id: currentSession.site_id,
        pair_id: currentSession.pair_id || undefined,
        type: 'end',
        verification_method: 'facial',
        latitude: 0, // Would get from navigator.geolocation
        longitude: 0,
        status: 'verified',
        ai_confidence_score: 95,
        pair_present: true,
      });

      setCurrentSession(null);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const addSite = async (site: Database['public']['Tables']['sites']['Insert']) => {
    try {
      const newSite = await sitesService.create(site);
      setSites([...sites, newSite]);
    } catch (error) {
      console.error('Error adding site:', error);
      throw error;
    }
  };

  const updateSite = async (id: string, updates: Partial<Database['public']['Tables']['sites']['Update']>) => {
    try {
      const updated = await sitesService.update(id, updates);
      setSites(sites.map(s => s.id === id ? updated : s));
    } catch (error) {
      console.error('Error updating site:', error);
      throw error;
    }
  };

  const deleteSite = async (id: string) => {
    try {
      await sitesService.delete(id);
      setSites(sites.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting site:', error);
      throw error;
    }
  };

  const addPair = async (pair: Database['public']['Tables']['pairs']['Insert']) => {
    try {
      const newPair = await pairsService.create(pair);
      setPairs([...pairs, newPair]);
    } catch (error) {
      console.error('Error adding pair:', error);
      throw error;
    }
  };

  const updatePair = async (id: string, updates: Partial<Database['public']['Tables']['pairs']['Update']>) => {
    try {
      const updated = await pairsService.update(id, updates);
      setPairs(pairs.map(p => p.id === id ? updated : p));
    } catch (error) {
      console.error('Error updating pair:', error);
      throw error;
    }
  };

  const deletePair = async (id: string) => {
    try {
      await pairsService.delete(id);
      setPairs(pairs.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting pair:', error);
      throw error;
    }
  };

  const addCheckIn = async (checkIn: Database['public']['Tables']['check_ins']['Insert']) => {
    try {
      const newCheckIn = await checkInsService.create(checkIn);
      setCheckIns([newCheckIn, ...checkIns]);
    } catch (error) {
      console.error('Error adding check-in:', error);
      throw error;
    }
  };

  const resolveAlert = async (id: string) => {
    if (!user) return;

    try {
      await alertsService.resolve(id, user.id);
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  };

  const refreshUsers = async () => {
    try {
      const userData = await usersService.getAll();
      setAllUsers(userData || []);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        currentUser: user,
        login,
        logout,
        register,
        currentSession,
        startSession,
        pauseSession,
        endSession,
        sites,
        addSite,
        updateSite,
        deleteSite,
        pairs,
        addPair,
        updatePair,
        deletePair,
        checkIns,
        addCheckIn,
        alerts,
        resolveAlert,
        allUsers,
        refreshUsers,
        loading: authLoading || loading,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuthContext() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuthContext must be used within a SupabaseAuthProvider');
  }
  return context;
}

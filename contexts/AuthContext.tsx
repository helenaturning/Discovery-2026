import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, PresenceSession, Site, Pair, AIAlert, CheckIn } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  currentSession: PresenceSession | null;
  sites: Site[];
  pairs: Pair[];
  alerts: AIAlert[];
  allUsers: User[];
  addSite: (site: Omit<Site, 'id' | 'createdAt'>) => void;
  updateSite: (id: string, site: Partial<Site>) => void;
  addPair: (pair: Omit<Pair, 'id' | 'createdAt'>) => void;
  updatePair: (id: string, pair: Partial<Pair>) => void;
  startPresenceSession: (siteId: string, locationConsent: boolean) => Promise<PresenceSession>;
  endPresenceSession: () => void;
  addCheckIn: (checkIn: Omit<CheckIn, 'id'>) => void;
  updateSessionStatus: (status: PresenceSession['status']) => void;
  // Session control functions (matching SupabaseAuthContext)
  startSession: () => Promise<void>;
  pauseSession: () => Promise<void>;
  endSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    role: 'employee',
    firstName: 'Jean',
    lastName: 'Dupont',
    employeeId: 'EMP001',
    email: 'jean.dupont@company.com',
    company: 'TechCorp',
    biometricId: 'bio-001',
    securityQuestion: 'Quel est le nom de votre premier animal ?',
    securityAnswer: 'Max',
    consents: {
      geolocation: true,
      biometric: true,
      privacy: true,
    },
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    role: 'employee',
    firstName: 'Marie',
    lastName: 'Martin',
    employeeId: 'EMP002',
    email: 'marie.martin@company.com',
    company: 'TechCorp',
    biometricId: 'bio-002',
    securityQuestion: 'Dans quelle ville êtes-vous né(e) ?',
    securityAnswer: 'Paris',
    consents: {
      geolocation: true,
      biometric: true,
      privacy: true,
    },
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    role: 'supervisor',
    firstName: 'Pierre',
    lastName: 'Bernard',
    employeeId: 'SUP001',
    email: 'pierre.bernard@company.com',
    company: 'TechCorp',
    securityQuestion: 'Quel est votre plat préféré ?',
    securityAnswer: 'Couscous',
    consents: {
      geolocation: true,
      biometric: true,
      privacy: true,
    },
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Système',
    employeeId: 'ADM001',
    email: 'admin@company.com',
    company: 'TechCorp',
    securityQuestion: 'Quel est le titre de votre livre préféré ?',
    securityAnswer: 'Fondation',
    consents: {
      geolocation: true,
      biometric: true,
      privacy: true,
    },
    createdAt: new Date('2024-01-01'),
  },
];

const mockSites: Site[] = [
  {
    id: 'site-1',
    name: 'Site Paris Centre',
    address: '123 Rue de Rivoli',
    city: 'Paris',
    latitude: 48.8606,
    longitude: 2.3376,
    radius: 100,
    createdBy: '3',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'site-2',
    name: 'Site Lyon Part-Dieu',
    address: '456 Rue de la République',
    city: 'Lyon',
    latitude: 45.7605,
    longitude: 4.8557,
    radius: 150,
    createdBy: '3',
    createdAt: new Date('2024-01-01'),
  },
];

const mockPairs: Pair[] = [
  {
    id: 'pair-1',
    employee1Id: '1',
    employee2Id: '2',
    siteId: 'site-1',
    active: true,
    createdAt: new Date('2024-01-01'),
  },
];

const mockAlerts: AIAlert[] = [
  {
    id: 'alert-1',
    employeeId: '1',
    type: 'gpsStable',
    severity: 'low',
    timestamp: new Date(),
    details: 'GPS coordinates have not changed in 2 hours',
    confidenceScore: 65,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<PresenceSession | null>(null);
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [pairs, setPairs] = useState<Pair[]>(mockPairs);
  const [alerts, setAlerts] = useState<AIAlert[]>(mockAlerts);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);

  const login = async (email: string, password: string) => {
    // Mock login - find user by email
    const user = allUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
    } else {
      throw new Error('User not found');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentSession(null);
  };

  const register = async (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      role: userData.role || 'employee',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      employeeId: userData.employeeId || '',
      email: userData.email || '',
      company: userData.company || '',
      biometricId: `bio-${Date.now()}`,
      securityQuestion: userData.securityQuestion,
      securityAnswer: userData.securityAnswer,
      consents: userData.consents || {
        geolocation: false,
        biometric: false,
        privacy: false,
      },
      createdAt: new Date(),
    };
    
    setAllUsers([...allUsers, newUser]);
    setCurrentUser(newUser);
  };

  const addSite = (siteData: Omit<Site, 'id' | 'createdAt'>) => {
    const newSite: Site = {
      ...siteData,
      id: `site-${Date.now()}`,
      createdAt: new Date(),
    };
    setSites([...sites, newSite]);
  };

  const updateSite = (id: string, siteData: Partial<Site>) => {
    setSites(sites.map(site => site.id === id ? { ...site, ...siteData } : site));
  };

  const addPair = (pairData: Omit<Pair, 'id' | 'createdAt'>) => {
    const newPair: Pair = {
      ...pairData,
      id: `pair-${Date.now()}`,
      createdAt: new Date(),
    };
    setPairs([...pairs, newPair]);
  };

  const updatePair = (id: string, pairData: Partial<Pair>) => {
    setPairs(pairs.map(pair => pair.id === id ? { ...pair, ...pairData } : pair));
  };

  const startPresenceSession = async (siteId: string, locationConsent: boolean): Promise<PresenceSession> => {
    if (!currentUser) throw new Error('No user logged in');
    
    const session: PresenceSession = {
      id: `session-${Date.now()}`,
      employeeId: currentUser.id,
      siteId,
      startTime: new Date(),
      status: 'present',
      checkIns: [],
      totalTime: 0,
      timeWithPair: 0,
      reliabilityScore: 100,
      locationTrackingConsented: locationConsent,
    };
    
    setCurrentSession(session);
    return session;
  };

  const endPresenceSession = () => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endTime: new Date(),
        status: 'notStarted' as const,
      };
      setCurrentSession(endedSession);
      
      // After a delay, clear the session
      setTimeout(() => {
        setCurrentSession(null);
      }, 5000);
    }
  };

  const addCheckIn = (checkInData: Omit<CheckIn, 'id'>) => {
    if (currentSession) {
      const newCheckIn: CheckIn = {
        ...checkInData,
        id: `checkin-${Date.now()}`,
      };
      
      setCurrentSession({
        ...currentSession,
        checkIns: [...currentSession.checkIns, newCheckIn],
      });
    }
  };

  const updateSessionStatus = (status: PresenceSession['status']) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status,
      });
    }
  };

  // Session control functions (matching SupabaseAuthContext)
  const startSession = async () => {
    if (!currentSession) throw new Error('No session started');
    const updatedSession = {
      ...currentSession,
      status: 'present' as const,
    };
    setCurrentSession(updatedSession);
  };

  const pauseSession = async () => {
    if (!currentSession) throw new Error('No session started');
    const updatedSession = {
      ...currentSession,
      status: 'paused' as const,
    };
    setCurrentSession(updatedSession);
  };

  const endSession = async () => {
    if (!currentSession) throw new Error('No session started');
    const updatedSession = {
      ...currentSession,
      status: 'notStarted' as const,
      endTime: new Date(),
    };
    setCurrentSession(updatedSession);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        currentSession,
        sites,
        pairs,
        alerts,
        allUsers,
        addSite,
        updateSite,
        addPair,
        updatePair,
        startPresenceSession,
        endPresenceSession,
        addCheckIn,
        updateSessionStatus,
        // Session control functions (matching SupabaseAuthContext)
        startSession,
        pauseSession,
        endSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
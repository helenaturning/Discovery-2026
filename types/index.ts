export type UserRole = 'employee' | 'supervisor' | 'admin';

export type PresenceStatus = 'notStarted' | 'present' | 'absent' | 'paused' | 'suspended';

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  company: string;
  biometricId?: string; // Simulated biometric identifier
  securityQuestion?: string;
  securityAnswer?: string;
  consents: {
    geolocation: boolean;
    biometric: boolean;
    privacy: boolean;
  };
  createdAt: Date;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  createdBy: string;
  createdAt: Date;
}

export interface Pair {
  id: string;
  employee1Id: string;
  employee2Id: string;
  siteId: string;
  active: boolean;
  createdAt: Date;
}

export interface CheckIn {
  id: string;
  employeeId: string;
  siteId: string;
  timestamp: Date;
  type: 'start' | 'periodic' | 'end';
  verificationMethod: 'facial' | 'question';
  latitude: number;
  longitude: number;
  status: 'verified' | 'failed';
  aiConfidenceScore: number;
  pairPresent: boolean;
  distanceToPair?: number;
}

export interface AIAlert {
  id: string;
  employeeId: string;
  type: 'gpsStable' | 'identicalSelfies' | 'noPair' | 'unrealisticMovement' | 'lateAuth';
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  details: string;
  confidenceScore: number;
}

export interface PresenceSession {
  id: string;
  employeeId: string;
  siteId: string;
  startTime: Date;
  endTime?: Date;
  status: PresenceStatus;
  checkIns: CheckIn[];
  totalTime: number; // in minutes
  timeWithPair: number; // in minutes
  reliabilityScore: number; // 0-100
  locationTrackingConsented: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

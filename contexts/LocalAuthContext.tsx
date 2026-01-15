import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';
import { USE_LOCAL_BACKEND } from '../config/app';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'employee' | 'supervisor' | 'admin';
}

interface LocalAuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: any) => Promise<void>;
    logout: () => void;
    register: (userData: any) => Promise<void>;
    // Add other methods as needed to match SupabaseAuthContext
}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined);

export const LocalAuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (!USE_LOCAL_BACKEND) {
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('auth_token');
            if (token) {
                // In a real app, we might want to fetch the current user profile here
                // For now, we'll assume the token is enough or we could decode it
                try {
                    // Placeholder for fetching user profile
                    // const user = await apiService.getProfile();
                    // setCurrentUser(user);
                } catch (error) {
                    localStorage.removeItem('auth_token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: any) => {
        const data = await apiService.login(email, password);
        setCurrentUser(data.user);
    };

    const register = async (userData: any) => {
        const data = await apiService.register(userData);
        setCurrentUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setCurrentUser(null);
    };

    return (
        <LocalAuthContext.Provider value={{ currentUser, loading, login, logout, register }}>
            {children}
        </LocalAuthContext.Provider>
    );
};

export const useLocalAuth = () => {
    const context = useContext(LocalAuthContext);
    if (context === undefined) {
        throw new Error('useLocalAuth must be used within a LocalAuthProvider');
    }
    return context;
};

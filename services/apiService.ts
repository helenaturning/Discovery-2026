import { API_BASE_URL } from '../config/app';

const getHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }
    return response.json();
};

export const apiService = {
    // Auth
    async login(email: string, password: any) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await handleResponse(response);
        if (data.token) localStorage.setItem('auth_token', data.token);
        return data;
    },

    async register(userData: any) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await handleResponse(response);
        if (data.token) localStorage.setItem('auth_token', data.token);
        return data;
    },

    // Sites
    async getSites() {
        const response = await fetch(`${API_BASE_URL}/sites`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    async createSite(site: any) {
        const response = await fetch(`${API_BASE_URL}/sites`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(site),
        });
        return handleResponse(response);
    },

    // Pairs
    async getPairs() {
        const response = await fetch(`${API_BASE_URL}/pairs`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    async createPair(pair: any) {
        const response = await fetch(`${API_BASE_URL}/pairs`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(pair),
        });
        return handleResponse(response);
    },

    // Sessions
    async getActiveSession() {
        const response = await fetch(`${API_BASE_URL}/sessions/active`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    async startSession(siteId: string, pairId: string) {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ site_id: siteId, pair_id: pairId }),
        });
        return handleResponse(response);
    },

    async endSession(sessionId: string) {
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/end`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Check-ins
    async createCheckIn(checkIn: any) {
        const response = await fetch(`${API_BASE_URL}/checkins`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(checkIn),
        });
        return handleResponse(response);
    },

    async getCheckInsToday() {
        const response = await fetch(`${API_BASE_URL}/checkins/today`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    }
};

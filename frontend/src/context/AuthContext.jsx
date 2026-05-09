import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    function login(payload) {
        const { _id, email, role, token: newToken } = payload;
        const userData = { _id, email, role };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', newToken);
        setUser(userData);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    }

    useEffect(() => {
        function handleExpired() {
            setUser(null);
            setToken(null);
        }
        window.addEventListener('auth:expired', handleExpired);
        return () => window.removeEventListener('auth:expired', handleExpired);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return ctx;
}

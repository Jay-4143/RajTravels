import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/me');
                    if (res.data.success) {
                        setUser(res.data.user);
                    }
                } catch (error) {
                    console.error("Auth Load Error:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Clean up legacy
    };

    const updateProfile = async (data) => {
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile', data);
            if (res.data.success) {
                setUser(res.data.user);
                return { success: true, message: res.data.message };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

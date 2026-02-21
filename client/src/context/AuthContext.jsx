import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/auth';
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
                    const res = await axios.get(`${API}/me`);
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

    /**
     * Register - returns { success, requiresVerification, email, message }
     */
    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${API}/register`, { name, email, password });
            if (res.data.success) {
                return {
                    success: true,
                    requiresVerification: res.data.requiresVerification || false,
                    email: res.data.email || email,
                    message: res.data.message,
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    /**
     * Verify OTP - returns { success, message }
     */
    const verifyOtp = async (email, otp) => {
        try {
            const res = await axios.post(`${API}/verify-otp`, { email, otp });
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                return { success: true, message: res.data.message };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Verification failed'
            };
        }
    };

    /**
     * Resend OTP
     */
    const resendOtp = async (email) => {
        try {
            const res = await axios.post(`${API}/resend-otp`, { email });
            return { success: res.data.success, message: res.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to resend OTP'
            };
        }
    };

    /**
     * Login - may return requiresVerification if email not verified
     */
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API}/login`, { email, password });
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            const data = error.response?.data;
            if (data?.requiresVerification) {
                return {
                    success: false,
                    requiresVerification: true,
                    email: data.email,
                    message: data.message,
                };
            }
            return {
                success: false,
                message: data?.message || 'Login failed'
            };
        }
    };

    /**
     * Google Sign-In
     */
    const googleLogin = async (googleData) => {
        try {
            const res = await axios.post(`${API}/google`, googleData);
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google login failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateProfile = async (data) => {
        try {
            const res = await axios.put(`${API}/profile`, data);
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
        <AuthContext.Provider value={{
            user, token, loading,
            login, register, verifyOtp, resendOtp, googleLogin, logout, updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

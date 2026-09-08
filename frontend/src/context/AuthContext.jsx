import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyOtpApi, resendOtpApi, socialLoginApi, googleAuthApi, fetchUserProfile, updateUserProfile } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('griho_auth_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on initial mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await fetchUserProfile(token);
          if (data.success) {
            setUser(data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to load user session:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('griho_auth_token', data.token);
      return data.user;
    }
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('griho_auth_token', data.token);
    }
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const data = await verifyOtpApi({ email, otp });
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('griho_auth_token', data.token);
      return data.user;
    }
    return data;
  };

  const resendOtp = async (email) => {
    return await resendOtpApi({ email });
  };

  const socialLogin = async (socialData) => {
    const data = await socialLoginApi(socialData);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('griho_auth_token', data.token);
      return data.user;
    }
  };

  const googleLogin = async ({ credential, code, redirectUri, role }) => {
    const data = await googleAuthApi({ credential, code, redirectUri, role });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('griho_auth_token', data.token);
      return data.user;
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('griho_auth_token');
  };

  const updateProfile = async (updateData) => {
    if (!token) return;
    const data = await updateUserProfile(updateData, token);
    if (data.success) {
      setUser(data.user);
      return data.user;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: Boolean(user),
        isLandlord: user?.role === 'landlord',
        login,
        register,
        verifyOtp,
        resendOtp,
        socialLogin,
        googleLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

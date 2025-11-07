'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';
import { se } from 'date-fns/locale';
import { set } from 'date-fns';

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    checkalreadtUser();
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const res = await apiPost('auth/register', { email, password }, false);
    setLoading(false);

    return res;
  };

  const checkalreadtUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserToken(token);
    }
    console.log('Checked existing user token:', loading);
    setLoading(false);
  }


  const signIn = async (email: string, password: string) => {
    setLoading(true);

    const res = await apiPost('auth/login', { email, password }, false);

    if (res?.statusCode === 200 || res?.statusCode === 201) {
      console.log('Sign-in successful:', res);
      const token = res.access_token;
      if (token) {
        localStorage.setItem('token', token);
        setUserToken(token);
        // console.log('Token stored successfully:', token);
        setLoading(false);

        return { status: true, message: res.message };
      }
    }

    setLoading(false);
    return { status: false, message: res.message };;
  };


  const signOut = async () => {
    localStorage.removeItem('token');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ loading, signIn, signOut, signUp, userToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

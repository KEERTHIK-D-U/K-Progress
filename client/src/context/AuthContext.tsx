import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userData: any) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
    }
  };

  const signup = async (userData: any) => {
    const response = await axios.post('http://localhost:5000/api/auth/signup', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (userData: any) => {
      if (!user) return;
      try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          const { data } = await axios.put('http://localhost:5000/api/auth/profile', userData, config);
           localStorage.setItem('user', JSON.stringify(data));
           setUser(data);
           return data;
      } catch (error) {
          console.error("Update failed", error);
          throw error;
      }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

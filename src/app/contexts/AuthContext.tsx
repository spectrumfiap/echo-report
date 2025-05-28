// src/app/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export const availableAlertTypes = [
  'Alagamentos', 
  'Quedas de árvore', 
  'Falta de Energia', 
  'Aglomerações em Abrigo', 
  'Vazamentos de Gás',
  'Deslizamentos de Terra'
] as const;

export type AlertType = typeof availableAlertTypes[number];

// Interface para os dados do usuário que serão armazenados
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  locationPreference?: string; 
  subscribedAlerts?: AlertType[]; 
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: StoredUser | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<StoredUser, 'id' | 'passwordHash'> & {password: string}) => Promise<{ success: boolean, message?: string }>;
  updateUserPreferences: (userId: string, preferences: { locationPreference?: string; subscribedAlerts?: AlertType[] }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_DB_KEY = 'echoReportUsersDB_v2';
const LOGGED_IN_USER_KEY = 'echoReportLoggedInUser_v2';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserJson = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (storedUserJson) {
      try {
        const loggedInUser = JSON.parse(storedUserJson) as StoredUser;
        setUser(loggedInUser);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
      }
    }
  }, []);

  const simulatePasswordHash = (password: string) => `simulated_hash_for_${password}`;

  const register = async (userData: Omit<StoredUser, 'id' | 'passwordHash'> & {password: string}): Promise<{ success: boolean, message?: string }> => {
    const usersDBJson = localStorage.getItem(USERS_DB_KEY);
    let usersDB: StoredUser[] = usersDBJson ? JSON.parse(usersDBJson) : [];

    if (usersDB.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'Este email já está registrado.' };
    }

    const newUser: StoredUser = {
      id: Math.random().toString(36).substring(2, 15),
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: simulatePasswordHash(userData.password),
      locationPreference: userData.locationPreference || '', 
      subscribedAlerts: userData.subscribedAlerts || [], 
    };
    usersDB.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDB));
    console.log('Usuário registrado (simulado):', newUser);
    return { success: true };
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const usersDBJson = localStorage.getItem(USERS_DB_KEY);
    const usersDB: StoredUser[] = usersDBJson ? JSON.parse(usersDBJson) : [];
    const foundUser = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser && foundUser.passwordHash === simulatePasswordHash(pass)) {
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(foundUser));
      setUser(foundUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  // Nova função para atualizar preferências
  const updateUserPreferences = async (userId: string, preferences: { locationPreference?: string; subscribedAlerts?: AlertType[] }): Promise<boolean> => {
    const usersDBJson = localStorage.getItem(USERS_DB_KEY);
    let usersDB: StoredUser[] = usersDBJson ? JSON.parse(usersDBJson) : [];
    const userIndex = usersDB.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return false; // Usuário não encontrado
    }

    usersDB[userIndex] = { ...usersDB[userIndex], ...preferences };
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDB));

    if (user && user.id === userId) {
      const updatedUser = { ...user, ...preferences };
      setUser(updatedUser);
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(updatedUser));
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, updateUserPreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
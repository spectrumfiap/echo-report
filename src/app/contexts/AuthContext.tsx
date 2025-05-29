// src/app/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export const availableAlertTypes = [
  'Alagamentos', 
  'Ventos Fortes', 
  'Deslizamentos', 
  'Incêndios Florestais Próximos', 
  'Falta de Energia Prolongada',
  'Problemas de Transporte Público'
] as const;

export type AlertType = typeof availableAlertTypes[number];

export interface StoredUser {
  id: string;
  name: string;
  email: string; // Email do usuário, ou o email especial do admin
  passwordHash: string; 
  locationPreference?: string;
  subscribedAlerts?: AlertType[];
  role?: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: StoredUser | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<StoredUser, 'id' | 'passwordHash' | 'role'> & {password: string}) => Promise<{ success: boolean, message?: string }>;
  updateUserPreferences: (userId: string, preferences: { locationPreference?: string; subscribedAlerts?: AlertType[] }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_DB_KEY = 'echoReportUsersDB_v3';
const LOGGED_IN_USER_KEY = 'echoReportLoggedInUser_v3';

// Email específico para o login do administrador
const ADMIN_EMAIL = "admin@echoreport.com"; // Você pode mudar isso

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserJson = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (storedUserJson) {
      try {
        const loggedInUser = JSON.parse(storedUserJson) as StoredUser;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        setIsAdmin(loggedInUser.role === 'admin');
      } catch (e) {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
      }
    }
  }, []);

  const simulatePasswordHash = (password: string) => `simulated_hash_for_${password}`;

  const register = async (userData: Omit<StoredUser, 'id' | 'passwordHash' | 'role'> & {password: string}): Promise<{ success: boolean, message?: string }> => {
    const usersDBJson = localStorage.getItem(USERS_DB_KEY);
    let usersDB: StoredUser[] = usersDBJson ? JSON.parse(usersDBJson) : [];

    if (usersDB.find(u => u.email.toLowerCase() === userData.email.toLowerCase()) || userData.email.toLowerCase() === ADMIN_EMAIL) {
      return { success: false, message: 'Este email já está registrado ou é reservado.' };
    }

    const newUser: StoredUser = {
      id: Math.random().toString(36).substring(2, 15),
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: simulatePasswordHash(userData.password),
      locationPreference: userData.locationPreference || '',
      subscribedAlerts: userData.subscribedAlerts || [],
      role: 'user',
    };
    usersDB.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDB));
    return { success: true };
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const lowerEmail = email.toLowerCase();
    
    // Lógica especial para admin usando um email específico
    if (lowerEmail === ADMIN_EMAIL && pass === 'admin') { // Senha 'admin' para o email de admin
      const adminUser: StoredUser = {
        id: 'admin_id_special',
        name: 'Administrador',
        email: ADMIN_EMAIL,
        passwordHash: simulatePasswordHash('admin'), // O hash aqui é só para consistência da estrutura
        role: 'admin',
        locationPreference: 'Todas as áreas',
        subscribedAlerts: [...availableAlertTypes]
      };
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
      setIsAuthenticated(true);
      setIsAdmin(true);
      console.log('Login de Administrador bem-sucedido para:', ADMIN_EMAIL);
      return true;
    }

    // Lógica para usuários normais
    const usersDBJson = localStorage.getItem(USERS_DB_KEY);
    const usersDB: StoredUser[] = usersDBJson ? JSON.parse(usersDBJson) : [];
    const foundUser = usersDB.find(u => u.email.toLowerCase() === lowerEmail);

    if (foundUser && foundUser.passwordHash === simulatePasswordHash(pass)) {
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(foundUser));
      setUser(foundUser);
      setIsAuthenticated(true);
      setIsAdmin(foundUser.role === 'admin'); // Garante que isAdmin seja false para usuários normais
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.push('/');
  };

  const updateUserPreferences = async (userId: string, preferences: { locationPreference?: string; subscribedAlerts?: AlertType[] }): Promise<boolean> => {
    const usersDBJson = localStorage.getItem(USERS_DB_KEY);
    let usersDB: StoredUser[] = usersDBJson ? JSON.parse(usersDBJson) : [];
    const userIndex = usersDB.findIndex(u => u.id === userId);

    if (userIndex === -1) return false;

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
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout, register, updateUserPreferences }}>
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
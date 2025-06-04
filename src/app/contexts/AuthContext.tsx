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
  email: string;
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
  register: (userData: Omit<StoredUser, 'id' | 'role'> & {password: string}) => Promise<{ success: boolean, message?: string }>;
  updateUserPreferences: (userId: string, preferences: { name?: string; locationPreference?: string; subscribedAlerts?: AlertType[] }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGGED_IN_USER_KEY = 'echoReportLoggedInUser_v3';
const ADMIN_EMAIL = "admin@echoreport.com";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const STATIC_API_KEY = process.env.NEXT_PUBLIC_STATIC_API_KEY || '1234';

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
      } catch (_e) {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
      }
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const lowerEmail = email.toLowerCase();

    if (lowerEmail === ADMIN_EMAIL && pass === 'admin') {
      const adminUser: StoredUser = {
        id: 'admin_id_special',
        name: 'Administrador',
        email: ADMIN_EMAIL,
        role: 'admin',
        locationPreference: 'Todas as áreas',
        subscribedAlerts: [...availableAlertTypes]
      };
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
      setIsAuthenticated(true);
      setIsAdmin(true);
      return true;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, { // USA API_BASE_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': STATIC_API_KEY, // USA STATIC_API_KEY
        },
        body: JSON.stringify({ email: lowerEmail, password: pass }),
      });

      if (!response.ok) {
        console.error("Falha no login da API:", response.status, await response.text().catch(() => ""));
        return false;
      }
      
      const loggedInUserFromApi = await response.json();

      if (loggedInUserFromApi) {
        const frontEndUser: StoredUser = {
          id: String(loggedInUserFromApi.userId || loggedInUserFromApi.id),
          name: loggedInUserFromApi.name || loggedInUserFromApi.nomeCompleto,
          email: loggedInUserFromApi.email,
          role: loggedInUserFromApi.role || 'user',
          locationPreference: loggedInUserFromApi.locationPreference,
          subscribedAlerts: loggedInUserFromApi.subscribedAlerts,
        };

        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(frontEndUser));
        setUser(frontEndUser);
        setIsAuthenticated(true);
        setIsAdmin(frontEndUser.role === 'admin');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro de rede ou outro erro ao tentar logar via API:', error);
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.push('/');
  };

  const register = async (
    userData: Omit<StoredUser, 'id' | 'role'> & { password: string }
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const payload = {
        nomeCompleto: userData.name,
        email: userData.email,
        password: userData.password,
        locationPreference: userData.locationPreference || "",
        subscribedAlerts: userData.subscribedAlerts || [],
      };

      const response = await fetch(`${API_BASE_URL}/usuarios/registrar`, { // USA API_BASE_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': STATIC_API_KEY, // USA STATIC_API_KEY
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let backendErrorMessage = `Erro HTTP: ${response.status} (${response.statusText || 'Bad Request'})`;
        try {
            const errorContentType = response.headers.get("content-type");
            if (errorContentType && errorContentType.includes("application/json")) {
                const errorData = await response.json();
                if (errorData) {
                    backendErrorMessage = errorData.message || errorData.title || errorData.detail || 
                                         (errorData.violations && errorData.violations[0]?.message) || 
                                         (typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
                }
            } else {
                const errorText = await response.text();
                if (errorText) { backendErrorMessage = errorText; }
            }
        } catch (e) { /* Mantém errorMessage original */ }
        return { success: false, message: backendErrorMessage };
      }
      return { success: true };

    } catch (error: unknown) {
      console.error('Falha ao registrar usuário via API:', error);
      let message = 'Falha ao conectar com o servidor para registro.';
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }
      return { success: false, message };
    }
  };
  
  const updateUserPreferences = async (
    userId: string, 
    preferences: { name?: string; locationPreference?: string; subscribedAlerts?: AlertType[] }
  ): Promise<boolean> => {
    // ATENÇÃO: Esta função precisa ser implementada para chamar sua API backend
    // para que as mudanças de preferência (e nome) sejam persistidas.
    console.warn("updateUserPreferences chamado, mas não está implementado para chamar a API backend.");
    
    // Lógica atual que só atualiza localmente:
    if (user && user.id === userId) {
      const updatedUserData: StoredUser = { 
        ...user,
        name: preferences.name !== undefined ? preferences.name : user.name,
        locationPreference: preferences.locationPreference !== undefined ? preferences.locationPreference : user.locationPreference,
        subscribedAlerts: preferences.subscribedAlerts !== undefined ? preferences.subscribedAlerts : user.subscribedAlerts,
      };
      setUser(updatedUserData);
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(updatedUserData));
      // Para um teste de UI, retornar true aqui pode ser suficiente,
      // mas para persistência real, o sucesso dependeria da resposta da API.
      return true; 
    }
    return false;
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
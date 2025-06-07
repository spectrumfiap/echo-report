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
  updateUserPreferences: (
    userId: string, 
    preferences: { name?: string; locationPreference?: string; subscribedAlerts?: AlertType[] }
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGGED_IN_USER_KEY = 'echoReportLoggedInUser_v3';
const ADMIN_EMAIL = "admin@echoreport.com";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://echoreport-api.onrender.com';
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
        id: 'admin_id_special', name: 'Administrador', email: ADMIN_EMAIL, role: 'admin',
        locationPreference: 'Todas as áreas', subscribedAlerts: [...availableAlertTypes]
      };
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
      setIsAuthenticated(true);
      setIsAdmin(true);
      return true;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
        body: JSON.stringify({ email: lowerEmail, password: pass }),
      });

      if (!response.ok) {
        console.error("Falha no login da API:", response.status, await response.text().catch(() => ""));
        return false;
      }
      
      const loggedInUserFromApi = await response.json();

      if (loggedInUserFromApi) {
        const frontEndUser: StoredUser = {
          id: String(loggedInUserFromApi.userId || loggedInUserFromApi.id || loggedInUserFromApi.id_usuario),
          name: loggedInUserFromApi.nomeCompleto || loggedInUserFromApi.name,
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

      const response = await fetch(`${API_BASE_URL}/usuarios/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': STATIC_API_KEY,
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
    userIdFromFrontend: string,
    preferences: { name?: string; locationPreference?: string; subscribedAlerts?: AlertType[] }
  ): Promise<boolean> => {
    
    if (!user || user.id !== userIdFromFrontend) {
        console.error("updateUserPreferences: Usuário não logado ou ID não corresponde.");
        return false;
    }

    if (userIdFromFrontend === 'admin_id_special') {
        console.warn("updateUserPreferences: Não é possível atualizar preferências do admin especial via API /usuarios/{id}. Atualizando localmente.");
        const localUpdate: Partial<StoredUser> = {};
        if (preferences.name !== undefined) localUpdate.name = preferences.name;
        if (preferences.locationPreference !== undefined) localUpdate.locationPreference = preferences.locationPreference;
        if (preferences.subscribedAlerts !== undefined) localUpdate.subscribedAlerts = preferences.subscribedAlerts;
        
        const updatedAdminUserData = { ...user, ...localUpdate };
        setUser(updatedAdminUserData);
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(updatedAdminUserData));
        return true;
    }

    const numericUserId = parseInt(userIdFromFrontend, 10);
    if (isNaN(numericUserId)) {
        console.error("updateUserPreferences: ID do usuário inválido para chamada API.");
        return false;
    }

    const payloadForApi = {
      userId: numericUserId,
      nomeCompleto: preferences.name !== undefined ? preferences.name : user.name,
      email: user.email,
      role: user.role,
      locationPreference: preferences.locationPreference !== undefined ? preferences.locationPreference : user.locationPreference,
      subscribedAlerts: preferences.subscribedAlerts !== undefined ? preferences.subscribedAlerts : user.subscribedAlerts,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${numericUserId}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': STATIC_API_KEY,
        },
        body: JSON.stringify(payloadForApi),
      });

      if (!response.ok) {
        let errorMsg = `Falha ao atualizar preferências na API: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.detail || errorMsg;
        } catch (e) { 
            const textError = await response.text().catch(() => "");
            if(textError) errorMsg = textError;
        }
        console.error(errorMsg);
        return false;
      }

      const updatedUserFromApi = await response.json(); 

      const frontEndUser: StoredUser = {
        id: String(updatedUserFromApi.userId || updatedUserFromApi.id || updatedUserFromApi.id_usuario || numericUserId), 
        name: updatedUserFromApi.nomeCompleto || updatedUserFromApi.name,
        email: updatedUserFromApi.email || user.email, 
        role: updatedUserFromApi.role || user.role,   
        locationPreference: updatedUserFromApi.locationPreference,
        subscribedAlerts: updatedUserFromApi.subscribedAlerts,
      };
      
      setUser(frontEndUser);
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(frontEndUser));
      return true;

    } catch (error) {
      console.error('Erro de rede ao atualizar preferências:', error);
      return false;
    }
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
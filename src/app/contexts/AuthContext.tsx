// src/app/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// ... (interfaces StoredUser, AlertType, availableAlertTypes, AuthContextType permanecem as mesmas)
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
  updateUserPreferences: (userId: string, preferences: { locationPreference?: string; subscribedAlerts?: AlertType[] }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGGED_IN_USER_KEY = 'echoReportLoggedInUser_v3';
const ADMIN_EMAIL = "admin@echoreport.com";


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
      const apiKey = '1234';
      const response = await fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ email: lowerEmail, password: pass }),
      });

      if (!response.ok) {
        return false;
      }
      
      const loggedInUserFromApi = await response.json();

      if (loggedInUserFromApi) {
        const frontEndUser: StoredUser = {
          id: String(loggedInUserFromApi.userId || loggedInUserFromApi.id),
          name: loggedInUserFromApi.name || loggedInUserFromApi.nomeCompleto, // Backend pode retornar 'nomeCompleto' ou 'name'
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
      const apiKey = '1234'; //API Key

      const payload = {
        nomeCompleto: userData.name, // Mapeia 'name' do frontend para 'nomeCompleto' do DTO
        email: userData.email,
        password: userData.password,
        locationPreference: userData.locationPreference || "", // Garante que não é undefined
        subscribedAlerts: userData.subscribedAlerts || [],   // Garante que não é undefined
      };

      const response = await fetch('http://localhost:8080/usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.text(); // Backend retorna mensagem de erro como texto simples
          errorMessage = errorData || errorMessage;
        } catch (e) {
        }
        return { success: false, message: errorMessage };
      }

      // A API retorna o usuário registrado no sucesso (201 CREATED)
      // Não precisamos fazer nada com o corpo da resposta aqui,
      // pois a página de registro já lida com o login.
      // const registeredUser = await response.json(); 
      return { success: true };

    } catch (error: any) {
      console.error('Falha ao registrar usuário via API:', error);
      return { success: false, message: error.message || 'Falha ao conectar com o servidor para registro.' };
    }
  };
  
  // A função updateUserPreferences também precisará chamar a API
  const updateUserPreferences = async (userId: string, preferences: { locationPreference?: string; subscribedAlerts?: AlertType[] }): Promise<boolean> => {
    console.warn("A função updateUserPreferences ainda usa localStorage. Precisa ser integrada com a API.");
    // Lógica de localStorage mantida por enquanto
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...preferences };
      setUser(updatedUser);
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(updatedUser));
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
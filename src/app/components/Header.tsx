// src/components/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  return (
    <header className="bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Image
            src="/assets/echoreportlogo.png"
            alt="EchoReport Logo"
            width={70}
            height={35}
            priority
          />
          <div className="h-8 w-px bg-white/50 mx-3"></div>
          <Image
            src="/assets/fiapwhite.png"
            alt="FIAP Logo"
            width={60}
            height={30}
          />
        </Link>

        <nav className="flex items-center space-x-4 md:space-x-6 text-sm md:text-base font-medium">
          <Link href="/pages/mapa" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Mapa</Link>
          <Link href="/pages/reportar" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Reportar</Link>
          <Link href="/pages/alertas" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Alertas</Link>
          <Link href="/pages/abrigos" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Abrigos</Link>
          
          {isAuthenticated ? (
            <>
              {isAdmin ? ( // Se for admin, mostra "Área do Colaborador"
                <Link href="/pages/colaborador" className="font-semibold hover:text-[var(--brand-text-header)]/80 transition-colors">
                  Área do Colaborador
                </Link>
              ) : ( // Se for usuário normal, mostra "Meu Perfil"
                <Link href="/pages/perfil" className="hover:text-[var(--brand-text-header)]/80 transition-colors">
                  Meu Perfil
                </Link>
              )}
              <button
                onClick={logout}
                className="hover:text-[var(--brand-text-header)]/80 transition-colors bg-transparent border-none p-0"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[var(--brand-text-header)]/80 transition-colors">
                Login
              </Link>
              <Link href="/registro" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors">
                Registrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
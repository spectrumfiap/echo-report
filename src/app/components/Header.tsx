// src/components/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navLinkBaseClassName = "transition-colors";
  const desktopNavLinkClassName = `${navLinkBaseClassName} hover:text-[var(--brand-text-header)]/80`;
  const mobileNavLinkClassName = `${navLinkBaseClassName} block px-3 py-2 rounded-md hover:bg-white/10 w-full text-left`;
  const mobileAuthButtonClassName = `${navLinkBaseClassName} block w-full text-left px-3 py-2 rounded-md bg-white/20 hover:bg-white/30 text-center`;

  return (
    <header className="bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] shadow-lg sticky top-0 z-50">
      {/*
        O container principal. Verifique se 'px-4' está aplicando padding em ambos os lados.
        Em telas pequenas, 'container' é width: 100%. 'mx-auto' centraliza quando há max-width (telas maiores).
      */}
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        {/* Logo Section - Adicionado flex-shrink-0 para evitar que encolha demais se o espaço for limitado */}
        <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity" onClick={handleLinkClick}>
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

        {/* Navegação Desktop: Escondida em mobile, visível a partir de 'md' */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-5 text-sm font-medium">
          <Link href="/mapa" className={desktopNavLinkClassName}>Mapa</Link>
          <Link href="/reportar" className={desktopNavLinkClassName}>Reportar</Link>
          <Link href="/alertas" className={desktopNavLinkClassName}>Alertas</Link>
          <Link href="/abrigos" className={desktopNavLinkClassName}>Abrigos</Link>
          <Link href="/blog" className={desktopNavLinkClassName}>Artigos</Link>
          <Link href="/quem-somos" className={desktopNavLinkClassName}>Quem Somos</Link>
          
          <div className="w-px h-5 bg-white/30"></div>

          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link href="/colaborador" className={`${desktopNavLinkClassName} font-semibold`}>
                  Área do Colaborador
                </Link>
              ) : (
                <Link href="/perfil" className={desktopNavLinkClassName}>
                  Meu Perfil
                </Link>
              )}
              <button
                onClick={logout}
                className={`${desktopNavLinkClassName} bg-transparent border-none p-0`}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={desktopNavLinkClassName}>
                Login
              </Link>
              <Link href="/registro" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors text-sm">
                Registrar
              </Link>
            </>
          )}
        </nav>

        {/* Botão do Menu Mobile: Visível em mobile, escondido a partir de 'md' */}
        {/* Adicionado flex-shrink-0 aqui também por precaução, embora geralmente não seja necessário para um botão pequeno */}
        <div className="md:hidden flex items-center flex-shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
            className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--brand-header-bg)] shadow-xl pb-4 border-t border-white/20">
          <nav className="container mx-auto px-4 pt-2 flex flex-col space-y-1 text-base font-medium">
            <Link href="/mapa" className={mobileNavLinkClassName} onClick={handleLinkClick}>Mapa</Link>
            <Link href="/reportar" className={mobileNavLinkClassName} onClick={handleLinkClick}>Reportar</Link>
            <Link href="/alertas" className={mobileNavLinkClassName} onClick={handleLinkClick}>Alertas</Link>
            <Link href="/abrigos" className={mobileNavLinkClassName} onClick={handleLinkClick}>Abrigos</Link>
            <Link href="/blog" className={mobileNavLinkClassName} onClick={handleLinkClick}>Artigos</Link>
            <Link href="/quem-somos" className={mobileNavLinkClassName} onClick={handleLinkClick}>Quem Somos</Link>
            
            <hr className="border-white/20 my-2" />

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link href="/colaborador" className={`${mobileNavLinkClassName} font-semibold`} onClick={handleLinkClick}>
                    Área do Colaborador
                  </Link>
                ) : (
                  <Link href="/perfil" className={mobileNavLinkClassName} onClick={handleLinkClick}>
                    Meu Perfil
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={mobileNavLinkClassName}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={mobileNavLinkClassName} onClick={handleLinkClick}>
                  Login
                </Link>
                <Link href="/registro" className={mobileAuthButtonClassName} onClick={handleLinkClick}>
                  Registrar
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
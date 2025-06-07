"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeSwitcher } from './ThemeSwitcher';

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinkBaseClassName = "transition-colors";
  const desktopNavLinkClassName = `${navLinkBaseClassName} hover:text-[var(--brand-text-header)]/80 text-base`;
  const mobileNavLinkClassName = `${navLinkBaseClassName} block px-3 py-2 rounded-md hover:bg-white/10 w-full text-left text-base`;
  const mobileAuthButtonClassName = `${navLinkBaseClassName} block w-full text-left px-3 py-2 rounded-md bg-white/20 hover:bg-white/30 text-center text-base`;

  return (
    <header className="bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity" onClick={handleLinkClick}>
          <Image
            src="/assets/echoreportlogo.png"
            alt="EchoReport Logo"
            width={70} 
            height={35}
            priority
            style={{ width: 'auto', height: 'auto' }} 
          />
          <div className="h-8 w-px bg-white/50 mx-3"></div>
          <Image
            src="/assets/fiapwhite.png"
            alt="FIAP Logo"
            width={60} 
            height={30}
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>

        <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6 text-base font-medium">
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
              <Link href="/registro" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors text-base">
                Registrar {}
              </Link>
            </>
          )}
          <ThemeSwitcher className="hover:bg-white/10 p-1" />
        </nav>

        <div className="lg:hidden flex items-center flex-shrink-0 space-x-2">
          <ThemeSwitcher className="hover:bg-white/10 p-1" />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
            className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-7 w-7" /> 
            ) : (
              <Bars3Icon className="h-7 w-7" /> 
            )}
          </button>
        </div>
      </div>

      <div
        className={`
          lg:hidden absolute top-full left-0 right-0 bg-[var(--brand-header-bg)] shadow-xl border-t border-white/20 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0'}
        `}
      >
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
                Registrar {}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
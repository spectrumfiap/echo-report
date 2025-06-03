// src/components/ThemeSwitcher.tsx
"use client";

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkModeStored = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkModeStored);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ${className}`}
      aria-label="Alternar Modo Escuro"
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5 text-yellow-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-white" /> // Ícone branco para melhor contraste no header atual
      )}
    </button>
  );
}
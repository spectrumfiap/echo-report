// src/components/Footer.tsx
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[var(--brand-footer-bg)] text-[var(--brand-text-footer)]">
      <div className="container mx-auto px-1 py-3">
        <div className="flex flex-col justify-between items-center">
          <p className="text-sm">
            &copy; {currentYear} Grupo Spectrum. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
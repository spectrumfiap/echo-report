// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[var(--brand-footer-bg)] text-[var(--brand-text-footer)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-sm">
          &copy; {currentYear} Grupo Spectrum. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
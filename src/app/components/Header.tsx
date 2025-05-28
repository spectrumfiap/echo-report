// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between"> {/* Ajustei o padding vertical um pouco */}
        
        {/* Seção do Logo Combinado */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Image
            src="/assets/echoreportlogo.png" 
            alt="EchoReport Logo" 
            width={70} // Ajustei um pouco o tamanho para acomodar melhor
            height={35} // Ajustei a altura para manter proporção ou como desejado
            priority // Adicionar priority se for o logo principal e estiver acima da dobra (LCP)
          />
          
          {/* Linha Divisória Vertical Branca */}
          <div className="h-8 w-px bg-white/50 mx-3"></div> {/* Ajuste h- (altura), bg- (cor) e mx- (margem) */}
        
          <Image
            src="/assets/fiapwhite.png" 
            alt="FIAP Logo"
            width={60} // Ajustei o tamanho para ser um pouco menor ou complementar
            height={30} // Ajustei a altura
          />
        </Link>

        <nav className="flex space-x-4 md:space-x-6 text-sm md:text-base font-medium"> {/* Ajustei tamanhos de fonte e espaçamento */}
          <Link href="/pages/mapa" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Mapa</Link>
          <Link href="/pages/reportar" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Reportar</Link>
          <Link href="/pages/alertas" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Alertas</Link>
          <Link href="/pages/abrigos" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Abrigos</Link>
          <Link href="/pages/perfil" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Perfil</Link>
        </nav>
      </div>
    </header>
  );
}
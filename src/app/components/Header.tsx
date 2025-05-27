// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image'; // Importe o componente Image do Next.js

export default function Header() {
  return (
    <header className="bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 md:py-2 flex items-center justify-between">
        {/* Substituindo o texto "EchoReport" pela imagem do logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/assets/echoreport.png" // Caminho para o seu logo na pasta public
            alt="EchoReport Logo" // Texto alternativo para acessibilidade
            width={80} // Largura em pixels (ajuste conforme o tamanho desejado)
            height={100} // Altura em pixels (ajuste para manter a proporção ou tamanho desejado)
            // Se o logo precisar mudar com o tema, você pode usar uma lógica aqui:
            // src={theme === 'dark' ? '/logo-echoreport-dark.png' : '/logo-echoreport-light.png'}
            // Para isso, você precisaria importar `useTheme` de `next-themes` aqui também.
          />
        </Link>

        <nav className="flex space-x-5 md:space-x-7 text-base md:text-lg font-medium">
          <Link href="/pages/mapa" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Mapa</Link>
          <Link href="/pages/reportar" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Reportar</Link>
          <Link href="/pages/alertas" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Alertas</Link>
          <Link href="/pages/abrigos" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Abrigos</Link> {/* Corrigi o link aqui para /pages/abrigos se for a intenção */}
          <Link href="/pages/perfil" className="hover:text-[var(--brand-text-header)]/80 transition-colors">Perfil</Link>
        </nav>
      </div>
    </header>
  );
}
// src/app/pages/quem-somos/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Dados dos participantes
const teamMembers = [
  {
    name: "Arthur Thomas",
    rm: "561061",
    turma: "1TDSPA",
    imageUrl: "/assets/Arthur.svg", 
    githubUrl: "https://github.com/athomasmariano",
    linkedinUrl: "https://www.linkedin.com/in/arthur-thomas-mariano-941a97234/"
  },
  {
    name: "Jhonatta Lima",
    rm: "560277",
    turma: "1TDSPA",
    imageUrl: "/assets/Jhonatta.svg",
    githubUrl: "https://github.com/JhonattaLimaSandesdeOLiveira",
    linkedinUrl: "https://www.linkedin.com/in/jhonatta-lima-732692332/"
  },
  {
    name: "Luann Noqueli",
    rm: "560313",
    turma: "1TDSPA",
    imageUrl: "/assets/Luann.svg",
    githubUrl: "https://github.com/luannoq",
    linkedinUrl: "https://www.linkedin.com/in/luann-noqueli-60628a2b0/"
  },
];

// Componente para o Card de cada Membro da Equipe
interface MemberCardProps {
  member: typeof teamMembers[0];
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <li className="flex flex-col items-center text-center bg-[var(--brand-card-background)] p-6 rounded-xl shadow-[var(--shadow-subtle)] w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1">
      <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 rounded-full overflow-hidden border-2 border-[var(--brand-header-bg)]/30">
        <Image
          src={member.imageUrl}
          alt={`Foto de ${member.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 128px, 160px"
        />
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-[var(--brand-text-primary)]">
        {member.name}
      </h3>
      <p className="text-sm text-[var(--brand-text-secondary)] mt-1">RM: {member.rm}</p>
      <p className="text-xs text-gray-500 mb-3">Turma: {member.turma}</p>
      
      <div className="flex space-x-4 mt-auto pt-3 border-t border-slate-200 w-full justify-center">
        {member.githubUrl && (
          <Link href={member.githubUrl} target="_blank" rel="noopener noreferrer" 
            className="text-[var(--brand-text-secondary)] hover:text-[var(--brand-header-bg)] transition-colors"
            title="GitHub"
          >
            <Image src="/assets/Github.svg" width={32} height={32} alt="GitHub Icon" />
          </Link>
        )}
        {member.linkedinUrl && (
          <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer"
            className="text-[var(--brand-text-secondary)] hover:text-[var(--brand-header-bg)] transition-colors"
            title="LinkedIn"
          >
            <Image src="/assets/Linkedin.svg" width={32} height={32} alt="LinkedIn Icon" />
          </Link>
        )}
      </div>
    </li>
  );
};


export default function QuemSomosPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)]">
          Nossa Equipe
        </h1>
        <p className="text-lg md:text-xl text-[var(--brand-text-secondary)] mt-4 max-w-2xl mx-auto">
          Conheça os estudantes da FIAP por trás do desenvolvimento da plataforma EchoReport.
        </p>
      </section>

      {/* Seção dos Cards dos Participantes */}
      {/* Usando flex-wrap para que os cards quebrem para a próxima linha conforme necessário */}
      <ul className="flex flex-wrap justify-center items-stretch gap-8 md:gap-10 lg:gap-12">
        {teamMembers.map((member) => (
          <MemberCard key={member.rm} member={member} />
        ))}
      </ul>

      <section className="mt-16 md:mt-20 py-12 bg-slate-50 rounded-xl">
          <div className="container mx-auto px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--brand-text-primary)] mb-6">Sobre o Projeto EchoReport</h2>
              <p className="text-md text-[var(--brand-text-secondary)] max-w-3xl mx-auto leading-relaxed">
                  O EchoReport nasceu da iniciativa de estudantes da FIAP para o Global Solution, com o desafio de criar soluções inovadoras para eventos extremos. Nossa missão é utilizar a tecnologia para conectar comunidades, fornecer informações cruciais em tempo real e contribuir para a construção de cidades mais preparadas e resilientes diante de desastres naturais e outros riscos urbanos.
              </p>
          </div>
      </section>
    </div>
  );
}
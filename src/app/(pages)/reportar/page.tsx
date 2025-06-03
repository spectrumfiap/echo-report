// src/app/reportar/page.tsx
"use client";

import React from 'react';
import ReportForm from '../../components/ReportForm'; 
import AnimatedSection from '../../components/AnimatedSection'; 


export default function ReportarPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <AnimatedSection animationType="fadeInUp" delay="duration-500">
        <section className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)] dark:text-blue-400">
            Reportar Ocorrência
          </h1>
          <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-xl mx-auto">
            Sua colaboração é fundamental para a segurança de todos. Descreva o evento ou risco que você observou.
          </p>
        </section>
      </AnimatedSection>

      <ReportForm />
    </div>
  );
}
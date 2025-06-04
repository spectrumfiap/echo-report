// seu-projeto/components/AnimatedSection.tsx (ou onde quer que esteja seu arquivo)

"use client";

import React, { ReactNode, Children, cloneElement, isValidElement } from 'react';
import { useInView } from 'react-intersection-observer';

interface ChildProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}

export interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  // CORREÇÃO AQUI: Adicionado 'fadeInDown' à lista de tipos
  animationType?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'fadeInDown';
  delay?: string;
  threshold?: number;
  staggerChildren?: boolean;
  childDelayIncrement?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animationType = 'fadeInUp',
  delay = 'duration-700',
  threshold = 0.1,
  staggerChildren = false,
  childDelayIncrement = 100,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: threshold,
  });

  const baseAnimationClasses = 'transition-all ease-out ' + delay;

  let effectInitialStyles: React.CSSProperties = {};
  let effectInViewStyles: React.CSSProperties = {};

  switch (animationType) {
    case 'fadeIn':
      effectInitialStyles = { opacity: 0 };
      effectInViewStyles = { opacity: 1 };
      break;
    case 'slideInLeft':
      effectInitialStyles = { opacity: 0, transform: 'translateX(-40px)' };
      effectInViewStyles = { opacity: 1, transform: 'translateX(0)' };
      break;
    case 'slideInRight':
      effectInitialStyles = { opacity: 0, transform: 'translateX(40px)' };
      effectInViewStyles = { opacity: 1, transform: 'translateX(0)' };
      break;
    // NOVO CASO: Adicionar a lógica para 'fadeInDown'
    case 'fadeInDown':
      effectInitialStyles = { opacity: 0, transform: 'translateY(-20px)' }; // Começa um pouco acima
      effectInViewStyles = { opacity: 1, transform: 'translateY(0)' };
      break;
    case 'fadeInUp':
    default:
      effectInitialStyles = { opacity: 0, transform: 'translateY(20px)' };
      effectInViewStyles = { opacity: 1, transform: 'translateY(0)' };
      break;
  }

  if (staggerChildren) {
    const flatChildren = Children.toArray(children);
    return (
      <div ref={ref} className={className}>
        {flatChildren.map((child, index) => {
          if (isValidElement<ChildProps>(child)) {
            const childProps = child.props;
            return cloneElement(child, {
              className: `${childProps.className || ''} ${baseAnimationClasses}`,
              style: {
                ...childProps.style,
                ...(inView ? effectInViewStyles : effectInitialStyles),
                transitionDelay: inView ? `${index * childDelayIncrement}ms` : '0ms',
              },
            });
          }
          return child;
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${baseAnimationClasses} ${className}`}
      style={inView ? effectInViewStyles : effectInitialStyles}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
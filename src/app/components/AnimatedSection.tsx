// src/components/AnimatedSection.tsx
"use client";

import React, { ReactNode, Children, cloneElement, isValidElement } from 'react';
import { useInView } from 'react-intersection-observer';

interface ChildProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animationType?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight';
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
  
  // Define os estilos iniciais e finais com base no animationType
  // Estes serão usados tanto para o wrapper (se não for stagger) quanto para os filhos (se for stagger)
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
    case 'fadeInUp': 
    default:
      effectInitialStyles = { opacity: 0, transform: 'translateY(20px)' }; 
      effectInViewStyles = { opacity: 1, transform: 'translateY(0)' }; 
      break;
  }

  if (staggerChildren) {
    const flatChildren = Children.toArray(children); // Desempacota React.Fragments
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
          return child; // Retorna nós de texto, null, etc., como estão
        })}
      </div>
    );
  }

  // Se não for staggerChildren, anima o wrapper principal
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
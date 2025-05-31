// src/components/AnimatedSection.tsx
"use client";

import React, { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface ChildProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface AnimatedSectionProps { // Exporte para usar em outros lugares se necessário
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
  let initialStyles: React.CSSProperties = {};
  let inViewStyles: React.CSSProperties = {};

  switch (animationType) {
    case 'fadeIn': initialStyles = { opacity: 0 }; inViewStyles = { opacity: 1 }; break;
    case 'slideInLeft': initialStyles = { opacity: 0, transform: 'translateX(-40px)' }; inViewStyles = { opacity: 1, transform: 'translateX(0)' }; break;
    case 'slideInRight': initialStyles = { opacity: 0, transform: 'translateX(40px)' }; inViewStyles = { opacity: 1, transform: 'translateX(0)' }; break;
    case 'fadeInUp': default: initialStyles = { opacity: 0, transform: 'translateY(20px)' }; inViewStyles = { opacity: 1, transform: 'translateY(0)' }; break;
  }

  if (staggerChildren && React.Children.count(children) > 0) {
    return (
      <div ref={ref} className={className}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement<ChildProps>(child)) {
            const childProps = child.props;
            const childInitialStyles = { opacity: 0, transform: 'translateY(20px)' };
            const childInViewStyles = { opacity: 1, transform: 'translateY(0)' };
            return React.cloneElement(child, {
              className: `${childProps.className || ''} ${baseAnimationClasses}`,
              style: { ...childProps.style, ...(inView ? childInViewStyles : childInitialStyles), transitionDelay: inView ? `${index * childDelayIncrement}ms` : '0ms' },
            });
          }
          return child;
        })}
      </div>
    );
  }
  return ( <div ref={ref} className={`${baseAnimationClasses} ${className}`} style={inView ? inViewStyles : initialStyles}> {children} </div> );
};

export default AnimatedSection;

import React from "react";

// Simple motion animation helpers

type MotionProps = {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  className?: string;
  children?: React.ReactNode;
};

const defaultTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1.0],
};

export const motion = {
  div: ({ 
    initial = {}, 
    animate = {}, 
    transition = defaultTransition, 
    className = "", 
    children 
  }: MotionProps) => {
    const combinedClasses = `${className} animate-fade-in`;
    
    return (
      <div className={combinedClasses} style={{ animationDuration: `${transition.duration}s` }}>
        {children}
      </div>
    );
  }
};

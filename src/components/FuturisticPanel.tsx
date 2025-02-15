import React from 'react';

interface FuturisticPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function FuturisticPanel({ children, className = '' }: FuturisticPanelProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl 
                      border border-white/10 shadow-lg transform-gpu transition-all duration-500
                      group-hover:from-white/15 group-hover:to-white/10">
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-1000
                      animate-shine rounded-2xl" />
      </div>

      {/* Inner glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-white/20 rounded-[20px] 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

      {/* Content container */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface EnergyOrbProps {
  isActive?: boolean;
  className?: string;
}

export const EnergyOrb: React.FC<EnergyOrbProps> = ({ isActive = false, className }) => {
  return (
    <div className={cn("relative w-64 h-64", className)}>
      {/* Main orb */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/80 to-primary/20 animate-float" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-slow" />
      
      {/* Inner glow */}
      <div className="absolute inset-8 rounded-full bg-primary/30 blur-md animate-glow-pulse" />
      
      {/* Active state glow */}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-secondary/30 blur-2xl animate-pulse" />
      )}
    </div>
  );
};
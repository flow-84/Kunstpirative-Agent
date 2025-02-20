import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface EnergyOrbProps {
  isActive: boolean;
  onClick?: () => void;
}

export function EnergyOrb({ isActive, onClick }: EnergyOrbProps) {
  return (
    <div 
      className={`
        w-48 h-48 rounded-full 
        bg-[url('../public/e56f3a_4d6a021e55c14ae39ba5b25fcfce9f11mv2.png')] bg-cover
        shadow-lg 
        transition-all duration-500 ease-in-out
        ${isActive ? 'scale-110 shadow-primary/50' : 'scale-100 opacity-80'}
        cursor-pointer
        hover:scale-105
        active:scale-95
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={isActive ? "Voice Assistant deaktivieren" : "Voice Assistant aktivieren"}
    >
      <div className={`
        w-full h-full rounded-full 
        bg-gradient-to-b from-background/80 to-background/20
        flex items-center justify-center
        transition-opacity duration-500
        ${isActive ? 'animate-pulse' : ''}
      `}>
        <div className={`
          w-32 h-32 rounded-full 
          bg-gradient-to-tr from-primary/20 to-primary/5
          flex items-center justify-center
          transition-transform duration-500
          ${isActive ? 'scale-110' : 'scale-100'}
        `} />
      </div>
    </div>
  );
}
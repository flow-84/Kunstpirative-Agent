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
        shadow-lg 
        transition-all duration-500 ease-in-out
        ${isActive ? 'scale-110 shadow-[0_0_0_2px_rgb(0,229,255)/50]' : 'scale-100 opacity-80'}
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
        bg-gradient-to-b from-[#00E5FF] to-[#00E5FF]
        flex items-center justify-center
        transition-opacity duration-500
        ${isActive ? 'animate-pulse' : ''}
      `}>
        <div className={`
          w-32 h-32 rounded-full 
          bg-gradient-to-tr from-[#00E5FF]/20 to-[#00E5FF]/5
          flex items-center justify-center
          transition-transform duration-500
          ${isActive ? 'scale-110' : 'scale-100'}
        `} />
      </div>
    </div>
  );
}

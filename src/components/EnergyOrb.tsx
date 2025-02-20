import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import logo from '@/assets/image.jpg';

interface EnergyOrbProps {
  isActive: boolean;
  onClick?: () => void;
}

export function EnergyOrb({ isActive, onClick }: EnergyOrbProps) {
  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.style.opacity = isActive ? '1' : '0';
    }
  }, [isActive]);

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
      <div className="w-full h-full rounded-full bg-[#00E5FF] flex items-center justify-center transition-opacity duration-500">
        <img ref={logoRef} src={logo} className="w-32 h-32" alt="Voice Assistant Logo" />
      </div>
    </div>
  );
}

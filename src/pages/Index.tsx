import React, { useState } from 'react';
import { EnergyOrb } from '@/components/EnergyOrb';
import { useToast } from '@/hooks/use-toast';
import { Conversation } from '@/components/Conversation';
import { Logo } from '@/components/Logo';
import { FuturisticPanel } from '@/components/FuturisticPanel';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleToggleListen = () => {
    setIsListening(!isListening);
    toast({
      title: !isListening ? "Voice Assistant aktiviert" : "Voice Assistant deaktiviert",
      description: !isListening ? "Ich höre zu..." : undefined,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col items-center justify-between overflow-hidden">
      {/* Background image and overlay */}
      <div className="fixed inset-0">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ 
            backgroundImage: 'url("/minimalist-interior-of-modern-living-room-3d-rende-2-KNAP5T2.jpg")',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-accent/30 to-accent/50" />
      </div>
      
      {/* Logo section - 2/3 height */}
      <div className="relative z-10 w-full flex-[2] flex items-center justify-center pt-8">
        <Logo className="transform hover:scale-105 transition-transform duration-300" />
      </div>
      
      {/* Main content section - 1/3 height */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-start gap-8 my-8">
        <FuturisticPanel className="w-[90%] max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <EnergyOrb 
              isActive={isListening} 
              onClick={handleToggleListen}
            />
            
            <div className="text-center">
              <h1 className="text-4xl font-light text-gray-800 mb-2">Voice Assistant</h1>
              <Conversation 
                isListening={isListening}
                onStatusChange={setIsListening}
              />
            </div>
          </div>
        </FuturisticPanel>
      </div>
    </div>
  );
};

export default Index;
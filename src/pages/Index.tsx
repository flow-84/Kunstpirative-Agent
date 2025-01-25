import React, { useState } from 'react';
import { EnergyOrb } from '@/components/EnergyOrb';
import { VoiceControls } from '@/components/VoiceControls';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleToggleListen = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice assistant stopped" : "Voice assistant listening...",
      duration: 2000,
    });
  };

  const handleOpenSettings = () => {
    toast({
      title: "Settings",
      description: "Settings panel will be implemented in the next version",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-accent to-accent/50" />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <EnergyOrb isActive={isListening} />
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">AI Voice Assistant</h1>
          <p className="text-primary/60">Tap the microphone to start</p>
        </div>
      </div>

      {/* Controls */}
      <VoiceControls
        isListening={isListening}
        onToggleListen={handleToggleListen}
        onOpenSettings={handleOpenSettings}
      />
    </div>
  );
};

export default Index;
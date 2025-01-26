import React, { useState } from 'react';
import { EnergyOrb } from '@/components/EnergyOrb';
import { VoiceControls } from '@/components/VoiceControls';
import { useToast } from '@/hooks/use-toast';
import { Conversation } from '@/components/Conversation';

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

  const handleOpenSettings = () => {
    toast({
      title: "Einstellungen",
      description: "Einstellungen werden in der nächsten Version implementiert",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-accent to-accent/50" />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <EnergyOrb 
          isActive={isListening} 
          onClick={handleToggleListen}
        />
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">AI Voice Assistant</h1>
          <Conversation 
            isListening={isListening}
            onStatusChange={setIsListening}
          />
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
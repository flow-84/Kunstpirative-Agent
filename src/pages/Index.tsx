import React, { useState } from 'react';
import { EnergyOrb } from '@/components/EnergyOrb';
import { VoiceControls } from '@/components/VoiceControls';
import { useToast } from '@/hooks/use-toast';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const { isProcessing, generateResponse } = useVoiceAssistant();

  const handleToggleListen = async () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Voice Assistant aktiviert",
        description: "Ich höre zu...",
        duration: 2000,
      });
      
      // Example response - this should be replaced with actual voice input processing
      await generateResponse("Hallo! Wie kann ich Ihnen helfen?");
    } else {
      toast({
        title: "Voice Assistant deaktiviert",
        duration: 2000,
      });
    }
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
        <EnergyOrb isActive={isListening || isProcessing} />
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">AI Voice Assistant</h1>
          <p className="text-primary/60">
            {isProcessing ? "Verarbeite..." : "Tippen Sie auf das Mikrofon zum Starten"}
          </p>
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
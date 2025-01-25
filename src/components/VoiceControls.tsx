import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceControlsProps {
  isListening: boolean;
  onToggleListen: () => void;
  onOpenSettings: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  onToggleListen,
  onOpenSettings,
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="w-12 h-12 rounded-full bg-background/20 backdrop-blur-md border-primary/20 hover:bg-background/30"
        onClick={onOpenSettings}
      >
        <Settings className="w-6 h-6 text-primary" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "w-16 h-16 rounded-full bg-background/20 backdrop-blur-md border-primary/20 hover:bg-background/30",
          isListening && "border-secondary animate-pulse"
        )}
        onClick={onToggleListen}
      >
        {isListening ? (
          <MicOff className="w-8 h-8 text-secondary" />
        ) : (
          <Mic className="w-8 h-8 text-primary" />
        )}
      </Button>
    </div>
  );
};
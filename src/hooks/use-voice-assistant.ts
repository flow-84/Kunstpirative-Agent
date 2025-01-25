import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVoiceAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const generateResponse = async (text: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voice: 'Aria' // Using a default voice, can be made configurable
        }
      });

      if (error) throw error;

      // Create an Audio element and play the response
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await audio.play();

      return data.audioContent;
    } catch (error) {
      console.error('Error generating voice response:', error);
      toast({
        title: "Fehler",
        description: "Es gab einen Fehler bei der Sprachgenerierung.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    generateResponse
  };
};
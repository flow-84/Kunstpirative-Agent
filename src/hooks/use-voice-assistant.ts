import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendChatMessage } from '@/services/api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useVoiceAssistant() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const { toast } = useToast();

  const generateResponse = useCallback(async (input: string) => {
    if (isProcessing) return; // Verhindere parallele Verarbeitung
    
    try {
      setIsProcessing(true);
      console.log('Verarbeite Spracheingabe:', input);
      
      const data = await sendChatMessage(input, history);
      console.log('Antwort erhalten:', data);
      
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        // Warte auf das Ende der Audio-Wiedergabe
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.onerror = resolve;
          audio.play().catch(console.error);
        });
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error('Fehler bei der Verarbeitung:', error);
      toast({
        title: "Fehler",
        description: "Konnte keine Antwort generieren",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [history, toast, isProcessing]);

  return {
    isProcessing,
    generateResponse,
    history
  };
}

// Typen-Deklarationen für die WebSpeech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
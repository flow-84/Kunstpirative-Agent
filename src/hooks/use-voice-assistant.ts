import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendChatMessage } from '@/services/api';

export function useVoiceAssistant() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const recognition = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const generateResponse = async (input: string) => {
    try {
      setIsProcessing(true);
      console.log('Verarbeite Spracheingabe:', input);
      
      const data = await sendChatMessage(input, history);
      console.log('Antwort erhalten:', data);
      
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        await audio.play();
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
      // Nach der Verarbeitung neu starten
      if (isActive && recognition.current) {
        try {
          recognition.current.start();
        } catch (error) {
          console.error('Fehler beim Neustarten der Spracherkennung:', error);
        }
      }
    }
  };

  const setupRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Fehler",
        description: "Spracherkennung wird in diesem Browser nicht unterstützt",
        variant: "destructive",
      });
      return null;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'de-DE';

    recognitionInstance.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Spracheingabe erkannt:', transcript);
      await generateResponse(transcript);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Spracherkennungsfehler:', event.error);
      if (event.error !== 'no-speech') {
        toast({
          title: "Fehler bei der Spracherkennung",
          description: event.error,
          variant: "destructive",
        });
      }
    };

    return recognitionInstance;
  }, [toast]);

  const startListening = useCallback(() => {
    if (!recognition.current) {
      recognition.current = setupRecognition();
    }

    if (recognition.current) {
      setIsActive(true);
      try {
        recognition.current.start();
      } catch (error) {
        console.error('Fehler beim Starten der Spracherkennung:', error);
      }
    }
  }, [setupRecognition]);

  const stopListening = useCallback(() => {
    setIsActive(false);
    if (recognition.current) {
      recognition.current.stop();
      recognition.current = null;
    }
  }, []);

  return {
    isProcessing,
    isActive,
    startListening,
    stopListening,
  };
}

// Typen-Deklarationen für die WebSpeech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/hooks/use-voice-assistant';

export async function sendChatMessage(message: string, history: Message[] = []) {
  const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-speech', {
    body: { 
      text: message,
      history
    }
  });

  if (speechError) throw speechError;

  if (!speechData?.audioContent) {
    throw new Error('Keine Audio-Daten erhalten');
  }

  return {
    message: speechData.message,
    audioContent: speechData.audioContent,
    history: speechData.history
  };
}

export async function testConnection() {
  try {
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { test: true }
    });
    
    console.log('Raw test response:', { data, error });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
} 
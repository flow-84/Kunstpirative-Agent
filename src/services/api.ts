import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(message: string, history: Message[] = []) {
  try {
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
  } catch (error) {
    throw error;
  }
} 
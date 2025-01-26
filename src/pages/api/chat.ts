import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    console.log('Received message:', message);

    const aiResponse = `Ich habe verstanden: "${message}". Wie kann ich Ihnen helfen?`;
    console.log('AI Response:', aiResponse);

    const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-speech', {
      body: { 
        text: aiResponse,
        voice: '9BWtsMINqrJLrRacOk9x'
      }
    });

    if (speechError) {
      console.error('Supabase function error:', speechError);
      throw speechError;
    }

    if (!speechData?.audioContent) {
      throw new Error('Keine Audio-Daten von der Text-to-Speech Funktion erhalten');
    }

    return res.status(200).json({
      message: aiResponse,
      audioContent: speechData.audioContent
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process request'
    });
  }
} 
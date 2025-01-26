declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';
const AGENT_ID = 'hzw0SFAAACNboeG4ZaBt';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  text: string;
  history: Message[];
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, history = [] } = await req.json() as RequestBody;

    if (!text?.trim()) {
      throw new Error('Text is required');
    }

    const agentResponse = await fetch(`${ELEVEN_LABS_API_URL}/assistant/${AGENT_ID}/chat`, {
      method: 'POST',
      headers: {
        'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text,
        history: history.map(msg => ({
          role: msg.role,
          text: msg.content
        }))
      }),
    });

    if (!agentResponse.ok) {
      const errorData = await agentResponse.text();
      throw new Error(`Agent error: ${errorData}`);
    }

    const agentData = await agentResponse.json();

    if (!agentData.assistant_response) {
      throw new Error('Keine Antwort vom Agent erhalten');
    }

    const voiceResponse = await fetch(`${ELEVEN_LABS_API_URL}/text-to-speech/${AGENT_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: agentData.assistant_response,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!voiceResponse.ok) {
      const errorData = await voiceResponse.text();
      throw new Error(`Voice error: ${errorData}`);
    }

    const arrayBuffer = await voiceResponse.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64Audio = btoa(Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join(''));

    const updatedHistory = [
      ...history,
      { role: 'user', content: text },
      { role: 'assistant', content: agentData.assistant_response }
    ];

    return new Response(
      JSON.stringify({
        message: agentData.assistant_response,
        audioContent: base64Audio,
        history: updatedHistory
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
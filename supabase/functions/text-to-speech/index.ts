import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';
const AGENT_ID = 'AJk7SNq1oEbSU6NuRVXb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, history = [] } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Sending message to agent:', text);

    // Korrekter Endpoint für den Agent
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
      console.error('Agent API error:', errorData);
      throw new Error(`Agent error: ${errorData}`);
    }

    const agentData = await agentResponse.json();
    console.log('Agent response:', agentData);

    if (!agentData.assistant_response) {
      throw new Error('Keine Antwort vom Agent erhalten');
    }

    // Text-to-Speech mit der Agent-Antwort
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
      console.error('Voice API error:', errorData);
      throw new Error(`Voice error: ${errorData}`);
    }
    const arrayBuffer = await voiceResponse.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64Audio = btoa(Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join(''));

    // Aktualisierte Historie
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
  } catch (error) {
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
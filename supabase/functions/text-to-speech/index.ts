import { createServer } from 'http';

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';
const AGENT_ID = Deno.env.get('ELEVEN_LABS_AGENT_ID') || '';

if (!AGENT_ID) {
  throw new Error('ELEVEN_LABS_AGENT_ID environment variable is not set');
}

console.log('Using AGENT_ID:', AGENT_ID);
console.log('Fetching from URL:', `${ELEVEN_LABS_API_URL}/projects/${AGENT_ID}/chat`);

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

interface AgentData {
  assistant_response: string;
  // Füge hier weitere Felder hinzu, die du erwartest
}

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end('ok');
    return;
  }

  try {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { text, history = [] } = JSON.parse(body) as RequestBody;

      if (!text?.trim()) {
        throw new Error('Text is required');
      }

      console.log('Sending data to agent:', {
        message: text,
        history: history.map(msg => ({
          role: msg.role,
          text: msg.content
        }))
      });

      const agentResponse = await fetch(`${ELEVEN_LABS_API_URL}/projects/${AGENT_ID}/chat`, {
        method: 'POST',
        headers: {
          'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY_2') || '',
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
        console.error('Agent response error:', errorData);
        throw new Error(`Agent error: ${errorData}`);
      }

      const agentData = await agentResponse.json() as AgentData;

      if (!agentData.assistant_response) {
        throw new Error('Keine Antwort vom Agent erhalten');
      }

      const voiceResponse = await fetch(`${ELEVEN_LABS_API_URL}/text-to-speech/${AGENT_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY_2') || '',
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

      res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: agentData.assistant_response,
        audioContent: base64Audio,
        history: updatedHistory
      }));
    });
  } catch (error: any) {
    console.error('Error:', error);
    res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}).listen(8000);
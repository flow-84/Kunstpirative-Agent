import axios from 'axios';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export class ElevenLabsService {
  private apiKey: string;
  private agentId: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
  }

  private getHeaders() {
    return {
      'Accept': 'application/json',
      'xi-api-key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getAgentInfo() {
    try {
      const response = await axios.get(
        `${ELEVENLABS_API_URL}/agent/${this.agentId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching agent info:', error);
      throw error;
    }
  }

  async startInteraction() {
    try {
      const response = await axios.post(
        `${ELEVENLABS_API_URL}/agent/${this.agentId}/start`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error starting interaction:', error);
      throw error;
    }
  }

  async sendMessage(interactionId: string, message: string) {
    try {
      const response = await axios.post(
        `${ELEVENLABS_API_URL}/agent/${this.agentId}/interaction/${interactionId}/message`,
        { text: message },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async endInteraction(interactionId: string) {
    try {
      const response = await axios.post(
        `${ELEVENLABS_API_URL}/agent/${this.agentId}/interaction/${interactionId}/end`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error ending interaction:', error);
      throw error;
    }
  }
}

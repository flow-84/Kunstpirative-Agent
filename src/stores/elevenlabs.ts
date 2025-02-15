import { defineStore } from 'pinia';
import { ElevenLabsService } from '@/integrations/elevenlabs';

export const useElevenLabsStore = defineStore('elevenlabs', {
  state: () => ({
    service: new ElevenLabsService(),
    currentInteractionId: null as string | null,
    isInteracting: false,
    messages: [] as Array<{ text: string; isUser: boolean }>,
    error: null as string | null,
  }),

  actions: {
    async startInteraction() {
      try {
        this.error = null;
        this.isInteracting = true;
        const response = await this.service.startInteraction();
        this.currentInteractionId = response.interaction_id;
      } catch (error) {
        this.error = 'Failed to start interaction';
        console.error(error);
      }
    },

    async sendMessage(message: string) {
      if (!this.currentInteractionId) {
        throw new Error('No active interaction');
      }

      try {
        this.error = null;
        this.messages.push({ text: message, isUser: true });
        
        const response = await this.service.sendMessage(
          this.currentInteractionId,
          message
        );
        
        this.messages.push({ 
          text: response.message.text, 
          isUser: false 
        });

        return response;
      } catch (error) {
        this.error = 'Failed to send message';
        console.error(error);
      }
    },

    async endInteraction() {
      if (!this.currentInteractionId) return;

      try {
        this.error = null;
        await this.service.endInteraction(this.currentInteractionId);
        this.currentInteractionId = null;
        this.isInteracting = false;
      } catch (error) {
        this.error = 'Failed to end interaction';
        console.error(error);
      }
    },

    clearMessages() {
      this.messages = [];
    },
  },
});

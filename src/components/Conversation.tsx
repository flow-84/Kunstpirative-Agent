'use client';
import { useConversation } from '@11labs/react';
import { useCallback, useEffect, useRef } from 'react';

interface ConversationProps {
  isListening: boolean;
  onStatusChange: (isActive: boolean) => void;
}

export function Conversation({ isListening, onStatusChange }: ConversationProps) {
  const conversationStarted = useRef(false);
  
  const conversation = useConversation({
    apiKey: import.meta.env.VITE_ELEVEN_LABS_API_KEY,
    onConnect: () => {
      console.log('Connected');
      conversationStarted.current = true;
      onStatusChange(true);
    },
    onDisconnect: () => {
      console.log('Disconnected');
      conversationStarted.current = false;
      onStatusChange(false);
    },
    onMessage: (message) => {
      console.log('Message:', message);
    },
    onError: (error) => {
      console.error('Error:', error);
      conversationStarted.current = false;
      onStatusChange(false);
    },
  });

  const startConversation = useCallback(async () => {
    if (conversationStarted.current) return;
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: 'hzw0SFAAACNboeG4ZaBt',
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      onStatusChange(false);
    }
  }, [conversation, onStatusChange]);

  const stopConversation = useCallback(async () => {
    if (!conversationStarted.current) return;
    
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to stop conversation:', error);
    }
  }, [conversation]);

  useEffect(() => {
    if (isListening && !conversationStarted.current) {
      startConversation();
    } else if (!isListening && conversationStarted.current) {
      stopConversation();
    }
  }, [isListening, startConversation, stopConversation]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <p className="text-primary/60 text-lg font-medium">
          {isListening ? "Ich höre zu..." : "Tippen Sie auf das Mikrofon zum Starten"}
        </p>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
        <span className="text-sm text-primary/60">
          {isListening ? "Aktiv" : "Inaktiv"}
        </span>
      </div>
    </div>
  );
} 
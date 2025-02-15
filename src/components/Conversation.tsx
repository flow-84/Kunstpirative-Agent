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
    apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      conversationStarted.current = true;
      onStatusChange(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      conversationStarted.current = false;
      onStatusChange(false);
    },
    onMessage: (message) => {
      console.log('Received message from ElevenLabs:', message);
    },
    onError: (error) => {
      console.error('ElevenLabs Error:', error);
      conversationStarted.current = false;
      onStatusChange(false);
    },
  });

  const startConversation = useCallback(async () => {
    if (conversationStarted.current) return;
    
    try {
      console.log('Starting conversation...');
      console.log('API Key:', import.meta.env.VITE_ELEVENLABS_API_KEY ? 'Present' : 'Missing');
      console.log('Agent ID:', import.meta.env.VITE_ELEVENLABS_AGENT_ID ? 'Present' : 'Missing');
      
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      
      await conversation.startSession({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
      });
      console.log('Session started successfully');
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
        {conversation.error && (
          <p className="text-red-500 text-sm mt-2">
            Fehler: {conversation.error.message || 'Ein unbekannter Fehler ist aufgetreten'}
          </p>
        )}
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
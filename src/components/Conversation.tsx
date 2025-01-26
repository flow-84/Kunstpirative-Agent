'use client';
import { useConversation } from '@11labs/react';
import { useCallback, useEffect } from 'react';

interface ConversationProps {
  isListening: boolean;
  onStatusChange: (isActive: boolean) => void;
}

export function Conversation({ isListening, onStatusChange }: ConversationProps) {
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      onStatusChange(true);
    },
    onDisconnect: () => {
      console.log('Disconnected');
      onStatusChange(false);
    },
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Start the conversation with your agent
      await conversation.startSession({
        agentId: 'AJk7SNq1oEbSU6NuRVXb', // Ihre Agent ID
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      onStatusChange(false);
    }
  }, [conversation, onStatusChange]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Effekt für Start/Stop basierend auf isListening
  useEffect(() => {
    if (isListening) {
      startConversation();
    } else {
      stopConversation();
    }
  }, [isListening, startConversation, stopConversation]);

  const getStatusText = () => {
    if (!isListening) return "";
    if (conversation.isSpeaking) return "Agent spricht...";
    return "Ich höre zu...";
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-primary/60">
        {getStatusText()}
      </p>
    </div>
  );
} 
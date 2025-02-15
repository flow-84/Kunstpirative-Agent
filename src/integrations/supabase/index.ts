import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typen für die Datenbank-Tabellen
export interface Conversation {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  elevenlabs_interaction_id: string;
}

export interface Message {
  id: string;
  created_at: string;
  conversation_id: string;
  content: string;
  is_user: boolean;
}

// Hilfsfunktionen für Datenbankoperationen
export const supabaseOperations = {
  async createConversation(userId: string, title: string, interactionId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          user_id: userId,
          title,
          elevenlabs_interaction_id: interactionId
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addMessage(conversationId: string, content: string, isUser: boolean) {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          content,
          is_user: isUser
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
};

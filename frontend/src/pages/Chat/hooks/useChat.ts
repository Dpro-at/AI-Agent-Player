import { useState, useCallback } from "react";
import chatApi from "../../../services/chat"; // FIXED: Use default import

export interface Conversation {
  id: number;
  uuid?: string; // NEW: UUID for unique links
  conversation_uuid?: string; // NEW: Alternative UUID field name
  conversation_link?: string; // NEW: ChatGPT-style link
  title: string;
  agent_id?: number;
  user_id: number;
  created_at: string;
  updated_at?: string;
  last_message?: any;
  unread_count?: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  content: string;
  sender_type: "user" | "agent";
  message_type?: string;
  created_at: string;
  agent_id?: number;
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await chatApi.getConversations();
      if (response.success) {
        setConversations(response.data.conversations || []);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // NEW: Load conversation by UUID
  const loadConversationByUuid = useCallback(
    async (conversationUuid: string): Promise<Conversation | null> => {
      setLoading(true);
      try {
        const response = await chatApi.getConversationByUuid(conversationUuid);
        if (response.success) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error loading conversation by UUID:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMessages = useCallback(async (conversationId: number | string) => {
    setLoading(true);
    try {
      const response = await chatApi.getMessages(conversationId);
      if (response.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // NEW: Load messages by conversation UUID
  const loadMessagesByUuid = useCallback(async (conversationUuid: string) => {
    setLoading(true);
    try {
      const response = await chatApi.getMessagesByUuid(conversationUuid);
      if (response.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages by UUID:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createConversation = useCallback(
    async (title: string, agentId: number): Promise<Conversation> => {
      setLoading(true);
      try {
        const response = await chatApi.createConversation({
          title,
          agent_id: agentId,
        });
        if (response.success) {
          const newConversation: Conversation = {
            id: response.data.conversation_id,
            uuid: response.data.conversation_uuid, // NEW: Store UUID
            conversation_uuid: response.data.conversation_uuid, // NEW: Alternative field
            conversation_link: response.data.conversation_link, // NEW: ChatGPT-style link
            title: response.data.title,
            agent_id: response.data.agent_id,
            user_id: 0, // Will be set by backend
            created_at: response.data.created_at,
          };

          // Add to conversations list
          setConversations((prev) => [newConversation, ...prev]);

          return newConversation;
        }
        throw new Error("Failed to create conversation");
      } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (
      conversationId: number | string,
      content: string,
      agentId?: number
    ) => {
      try {
        // Check if we have a UUID in currentConversation
        const conversationUuid =
          currentConversation?.uuid || currentConversation?.conversation_uuid;

        let response;
        if (conversationUuid) {
          // NEW: Use UUID-based endpoint
          response = await chatApi.sendMessageByUuid(conversationUuid, {
            content,
            sender_type: "user",
            agent_id: agentId,
          });
        } else {
          // Fallback to ID-based endpoint
          response = await chatApi.sendMessage(conversationId, {
            content,
            sender_type: "user",
            agent_id: agentId,
          });
        }

        if (response.success) {
          // Reload messages to get the new message and any AI response
          if (conversationUuid) {
            await loadMessagesByUuid(conversationUuid);
          } else {
            await loadMessages(conversationId);
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [currentConversation, loadMessages, loadMessagesByUuid]
  );

  // NEW: Update conversation by UUID
  const updateConversationByUuid = useCallback(
    async (conversationUuid: string, updates: Partial<Conversation>) => {
      setLoading(true);
      try {
        const response = await chatApi.updateConversationByUuid(
          conversationUuid,
          updates
        );
        if (response.success) {
          // Update local state
          setConversations((prev) =>
            prev.map((conv) =>
              conv.uuid === conversationUuid ||
              conv.conversation_uuid === conversationUuid
                ? { ...conv, ...updates, updated_at: response.data.updated_at }
                : conv
            )
          );

          // Update current conversation if it's the one being updated
          if (
            currentConversation &&
            (currentConversation.uuid === conversationUuid ||
              currentConversation.conversation_uuid === conversationUuid)
          ) {
            setCurrentConversation((prev) =>
              prev ? { ...prev, ...updates } : null
            );
          }

          return response.data;
        }
        throw new Error("Failed to update conversation");
      } catch (error) {
        console.error("Error updating conversation:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentConversation]
  );

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    loadConversations,
    loadConversationByUuid, // NEW: Export UUID function
    loadMessages,
    loadMessagesByUuid, // NEW: Export UUID function
    createConversation,
    sendMessage,
    updateConversationByUuid, // NEW: Export UUID function
    setCurrentConversation,
  };
};

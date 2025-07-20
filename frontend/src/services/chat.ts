import api from "./api";

export interface ConversationCreateRequest {
  title: string;
  agent_id: number;
}

export interface ConversationUpdateRequest {
  title?: string;
  agent_id?: number;
  context_data?: Record<string, unknown>; // FIXED: Replace any with specific type
  is_active?: boolean;
}

export interface MessageCreateRequest {
  content: string;
  sender_type?: "user" | "agent";
  agent_id?: number;
}

export const chatApi = {
  // Existing conversation management
  getConversations: async () => {
    return api.get("/chat/conversations");
  },

  createConversation: async (data: ConversationCreateRequest) => {
    return api.post("/chat/conversations", data);
  },

  getConversation: async (conversationId: number | string) => {
    return api.get(`/chat/conversations/${conversationId}`);
  },

  updateConversation: async (
    conversationId: number | string,
    data: ConversationUpdateRequest
  ) => {
    return api.put(`/chat/conversations/${conversationId}`, data);
  },

  deleteConversation: async (conversationId: number | string) => {
    return api.delete(`/chat/conversations/${conversationId}`);
  },

  // NEW: UUID-based conversation management (ChatGPT-style)
  getConversationByUuid: async (conversationUuid: string) => {
    return api.get(`/chat/c/${conversationUuid}`);
  },

  updateConversationByUuid: async (
    conversationUuid: string,
    data: ConversationUpdateRequest
  ) => {
    return api.put(`/chat/c/${conversationUuid}`, data);
  },

  deleteConversationByUuid: async (conversationUuid: string) => {
    return api.delete(`/chat/c/${conversationUuid}`);
  },

  // Existing message management
  getMessages: async (
    conversationId: number | string,
    limit = 50,
    offset = 0
  ) => {
    return api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { limit, offset },
    });
  },

  sendMessage: async (
    conversationId: number | string,
    data: MessageCreateRequest
  ) => {
    return api.post(`/chat/conversations/${conversationId}/messages`, data);
  },

  // NEW: UUID-based message management (ChatGPT-style)
  getMessagesByUuid: async (
    conversationUuid: string,
    limit = 50,
    offset = 0
  ) => {
    return api.get(`/chat/c/${conversationUuid}/messages`, {
      params: { limit, offset },
    });
  },

  sendMessageByUuid: async (
    conversationUuid: string,
    data: MessageCreateRequest
  ) => {
    return api.post(`/chat/c/${conversationUuid}/messages`, data);
  },

  // NEW: Generate shareable conversation link
  getConversationLink: (conversationUuid: string) => {
    return `${window.location.origin}/chat/c/${conversationUuid}`;
  },

  // NEW: Extract UUID from ChatGPT-style URL
  extractUuidFromUrl: (url: string): string | null => {
    const match = url.match(/\/chat\/c\/([a-f0-9-]{36})/i);
    return match ? match[1] : null;
  },

  // NEW: Validate UUID format
  isValidUuid: (uuid: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },
};

// Default export for consistency with other services
export default chatApi;

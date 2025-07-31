/**
 * ===============================
 * 🚀 CHAT PAGE - MAIN CONTAINER
 * ===============================
 * 
 * This is the main chat interface container that orchestrates all chat components.
 * Updated for enhanced message system and file upload integration.
 * 
 * ===============================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import chatService from '../../services/chat';
import agentsService from '../../services/agents';
import { 
  EnhancedConversationsSidebar, 
  MessageList, 
  ChatInput, 
  ChatHeader
} from './components';
import { AdvancedSettingsModal } from './components/AdvancedSettingsModal';
import type { UploadedFile } from './components/FileUpload';
import type { Conversation, Message, LegacyMessage, Agent, TextContent } from './types';
import { convertLegacyMessage } from './types';
import './ChatPage.css';
import './components/EnhancedSidebar.css';

// Mock data for fallback
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'General Chat',
    updated_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    is_pinned: false,
    is_active: true,
    user_id: 1,
    message_count: 0,
    agent_name: 'General Assistant'
  },
  {
    id: '2',
    title: 'Project Planning Discussion',
    updated_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    is_pinned: true,
    is_active: true,
    user_id: 1,
    message_count: 12,
    agent_name: 'Planning Assistant',
    last_message_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '3',
    title: 'Technical Questions',
    updated_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    is_pinned: false,
    is_active: true,
    user_id: 1,
    message_count: 7,
    agent_name: 'Tech Support',
    last_message_at: new Date(Date.now() - 345600000).toISOString()
  }
];

const mockAgents: Agent[] = [
  {
    id: 1,
    name: 'General Assistant',
    model_provider: 'openai',
    model_name: 'gpt-4',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const ChatPage: React.FC = () => {
  const { chatId, conversationUuid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Core State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [backendError, setBackendError] = useState(false);
  
  // AI State
  const [aiTyping, setAiTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);

  // File Upload State
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);

  // Load initial data
  useEffect(() => {
    loadConversations();
    loadAgents();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    if (conversationUuid && conversations.length > 0) {
      const conversation = conversations.find(c => c.uuid === conversationUuid);
      if (conversation) {
        selectConversation(conversation);
      }
    } else if (chatId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === chatId);
      if (conversation) {
        selectConversation(conversation);
      }
    }
  }, [chatId, conversationUuid, conversations]);

  // Load conversations
  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading conversations...');
      const response = await chatService.getConversations();
      console.log('📊 Conversations response:', response);
      
      // Handle AxiosResponse - data is in response.data
      let conversationsData = [];
      
      if (response.data) {
        // Try different possible data structures from backend
        if (response.data.success && response.data.data?.conversations) {
          conversationsData = response.data.data.conversations;
        } else if (response.data.conversations) {
          conversationsData = response.data.conversations;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          conversationsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          conversationsData = response.data;
        }
      }
      
      console.log('✅ Conversations data:', conversationsData);
      
      if (conversationsData.length > 0) {
        const convs = conversationsData.map((c: any) => ({
          id: String(c.id),
          title: c.title || 'Untitled Conversation',
          updated_at: c.updated_at || new Date().toISOString(),
          created_at: c.created_at || new Date().toISOString(),
          is_pinned: c.is_pinned || false,
          is_active: c.is_active !== false,
          user_id: c.user_id || 1,
          uuid: c.uuid || c.conversation_uuid, // Handle both field names
          agent_id: c.agent_id
        }));
        
        setConversations(convs);
        setBackendError(false);
        console.log('✅ Conversations loaded successfully:', convs.length);
      } else {
        console.warn('⚠️ No conversations found, using mock data');
        setConversations(mockConversations);
        setBackendError(true);
      }
    } catch (error) {
      console.error('❌ Failed to load conversations:', error);
      setConversations(mockConversations);
      setBackendError(true);
    } finally {
      setLoading(false);
    }
  };

  // Load agents
  const loadAgents = async () => {
    try {
      console.log('🔄 Loading agents...');
      const response = await agentsService.getAgents();
      console.log('🤖 Agents response:', response);
      
      const agentsList = response.map((a: any) => ({
        id: a.id,
        name: a.name,
        model_provider: a.model_provider,
        model_name: a.model_name,
        is_active: a.is_active !== false,
        created_at: a.created_at || new Date().toISOString(),
        updated_at: a.updated_at || new Date().toISOString(),
        description: a.description
      }));
      setAgents(agentsList);
      
      if (agentsList.length > 0 && !selectedAgent) {
        setSelectedAgent(agentsList[0]);
        console.log('✅ Selected default agent:', agentsList[0].name);
      }
      console.log('✅ Agents loaded successfully:', agentsList.length);
    } catch (error) {
      console.error('❌ Failed to load agents:', error);
      setAgents(mockAgents);
      setSelectedAgent(mockAgents[0]);
    }
  };

  // Load messages for conversation
  const loadMessages = async (conversationId: string, conversationUuid?: string) => {
    try {
      setLoading(true);
      console.log('🔄 Loading messages for conversation:', conversationId);
      let response;
      
      // Only try UUID endpoint if we have a real UUID (not mock data)
      if (conversationUuid && conversationUuid !== 'mock-uuid-1' && !conversationUuid.startsWith('mock-')) {
        try {
          response = await chatService.getMessagesByUuid(conversationUuid);
        } catch (error) {
          console.log('UUID endpoint failed, falling back to ID endpoint');
          response = await chatService.getMessages(conversationId);
        }
      } else {
        response = await chatService.getMessages(conversationId);
      }
      
      console.log('📊 Messages response:', response);
      
      // Handle AxiosResponse - data is in response.data
      let messagesData = [];
      
      if (response.data) {
        if (response.data.success && response.data.data?.messages) {
          messagesData = response.data.data.messages;
        } else if (response.data.messages) {
          messagesData = response.data.messages;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          messagesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          messagesData = response.data;
        }
      }
      
      if (messagesData.length > 0) {
        const msgs = messagesData.map((m: any) => {
          // Convert legacy message format to new enhanced format
          const legacyMessage: LegacyMessage = {
            id: String(m.id),
            content: String(m.content || ''),
            sender_type: m.sender_type === 'user' ? 'user' : 'agent',
            sender_name: m.sender_type === 'user' ? 'You' : 'Assistant',
            message_type: 'text' as const,
            status: 'sent' as const,
            tokens_used: m.tokens_used,
            processing_time: m.processing_time,
            created_at: String(m.created_at || new Date().toISOString()),
            updated_at: m.updated_at
          };
          
          // Convert to new enhanced message format
          const enhancedMessage = convertLegacyMessage(legacyMessage);
          enhancedMessage.conversationId = conversationId;
          
          return enhancedMessage;
        });
        
        setMessages(msgs);
        console.log('✅ Messages loaded successfully:', msgs.length);
      } else {
        console.log('ℹ️ No messages found in this conversation');
        setMessages([]);
      }
    } catch (error) {
      console.error('❌ Failed to load messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Select conversation
  const selectConversation = (conversation: Conversation) => {
    console.log('📝 Selecting conversation:', conversation.title);
    setCurrentConversation(conversation);
    loadMessages(conversation.id, conversation.uuid);
    
    // Update URL
    if (conversation.uuid) {
      navigate(`/dashboard/chat/c/${conversation.uuid}`, { replace: true });
    } else {
      navigate(`/dashboard/chat/${conversation.id}`, { replace: true });
    }
  };

  // Create new conversation
  const createConversation = async () => {
    if (!selectedAgent) {
      console.warn('⚠️ No agent selected, cannot create conversation');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔄 Creating new conversation...');
      const response = await chatService.createConversation({
        title: 'New Conversation',
        agent_id: selectedAgent.id
      });
      
      console.log('📊 Create conversation response:', response);
      
      if (response.data) {
        let responseData = response.data;
        
        // Handle different response structures
        if (response.data.success && response.data.data) {
          responseData = response.data.data;
        }
        
        const newConv: Conversation = {
          id: String(responseData.conversation_id),
          title: responseData.title || 'New Conversation',
          updated_at: new Date().toISOString(),
          created_at: responseData.created_at || new Date().toISOString(),
          is_pinned: false,
          is_active: true,
          user_id: 1,
          uuid: responseData.conversation_uuid,
          agent_id: selectedAgent.id
        };
        
        setConversations(prev => [newConv, ...prev]);
        
        // Navigate to new conversation
        if (newConv.uuid) {
          navigate(`/dashboard/chat/c/${newConv.uuid}`);
        } else {
          navigate(`/dashboard/chat/${newConv.id}`);
        }
        console.log('✅ Conversation created successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Failed to create conversation:', error);
      alert('Failed to create conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !currentConversation || !selectedAgent) {
      console.warn('⚠️ Cannot send message: missing required data');
      return;
    }
    
    console.log('📤 Sending message...');
    
    // Create enhanced message with proper content structure
    const textContent: TextContent = {
      type: 'text',
      text: messageInput.trim(),
      formatted: false
    };
    
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: currentConversation.id,
      content: textContent,
      rawContent: messageInput.trim(),
      sender_type: 'user',
      sender_name: 'You',
      created_at: new Date().toISOString(),
      status: 'sending',
      attachments: attachedFiles.length > 0 ? attachedFiles.map(file => ({
        id: file.id,
        filename: file.name,
        filesize: file.size,
        mimetype: file.type,
        url: file.preview || '',
        status: 'uploaded' as const
      })) : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    setAttachedFiles([]); // Clear attached files
    setIsGeneratingResponse(true);
    
    try {
      const response = await chatService.sendMessage(currentConversation.id, {
        content: userMessage.rawContent || messageInput.trim(),
        agent_id: selectedAgent.id
      });
      
      console.log('📊 Send message response:', response);
      
      if (response.data) {
        let responseData = response.data;
        
        // Handle different response structures
        if (response.data.success && response.data.data) {
          responseData = response.data.data;
        }
        
        if (responseData.ai_response) {
          // Create enhanced AI response message
          const aiTextContent: TextContent = {
            type: 'text',
            text: String(responseData.ai_response),
            formatted: false
          };
          
          const aiMessage: Message = {
            id: responseData.message_id || `ai-${Date.now()}`,
            conversationId: currentConversation.id,
            content: aiTextContent,
            rawContent: String(responseData.ai_response),
            sender_type: 'agent',
            sender_name: 'Assistant',
            created_at: new Date().toISOString(),
            status: 'sent',
            metadata: {
              totalTokens: responseData.tokens_used,
              processingTime: responseData.processing_time
            }
          };
          
          // Update user message status
          setMessages(prev => prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'sent' as const, id: responseData.user_message_id || msg.id }
              : msg
          ));
          
          // Add AI response
          setMessages(prev => [...prev, aiMessage]);
          console.log('✅ Message sent successfully');
          
          // Reload messages to ensure we have the latest data
          setTimeout(() => {
            loadMessages(currentConversation.id, currentConversation.uuid);
          }, 500);
        } else {
          console.warn('⚠️ No ai_response found in response data:', responseData);
        }
      } else {
        console.error('❌ No response data received');
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      // Update user message status to error
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'error' as const }
          : msg
      ));
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Delete conversation
  const deleteConversation = async (convId: string) => {
    try {
      console.log('🗑️ Deleting conversation:', convId);
      await chatService.deleteConversation(convId);
      setConversations(prev => prev.filter(c => c.id !== convId));
      
      if (currentConversation?.id === convId) {
        setCurrentConversation(null);
        setMessages([]);
        navigate('/dashboard/chat');
      }
      console.log('✅ Conversation deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete conversation:', error);
    }
  };

  // Voice recording handlers
  const handleStartListening = () => {
    setIsListening(true);
    console.log('🎤 Started voice recording');
    // Implement voice recording logic
  };

  const handleStopListening = () => {
    setIsListening(false);
    console.log('🛑 Stopped voice recording');
    // Implement stop recording logic
  };

  // File upload handler - Updated to match new signature
  const handleFileUpload = async (file: UploadedFile): Promise<string> => {
    console.log('📎 File uploaded:', file);
    
    try {
      // Here you would typically upload the file to your server
      // For now, we'll just return the preview URL or a placeholder
      return file.preview || `uploaded://${file.name}`;
    } catch (error) {
      console.error('❌ File upload failed:', error);
      throw error;
    }
  };

  // Files change handler - New handler for file management
  const handleFilesChange = (files: UploadedFile[]) => {
    console.log('📁 Files changed:', files);
    setAttachedFiles(files);
  };

  // Copy message handler
  const handleCopyMessage = (content: string) => {
    console.log('📋 Message copied:', content);
    navigator.clipboard.writeText(content).catch(console.error);
  };

  // Message actions
  const handleEditMessage = (messageId: string) => {
    console.log('✏️ Edit message:', messageId);
    // Implement edit functionality
  };

  const handleDeleteMessage = (messageId: string) => {
    console.log('🗑️ Delete message:', messageId);
    // Implement delete functionality
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    console.log('😀 React to message:', messageId, emoji);
    // Implement reaction functionality
  };

  const handleDownloadFile = (url: string, filename: string) => {
    console.log('💾 Download file:', filename);
    // Implement file download
  };

  return (
    <div className="chat-page">
      {/* Backend Error Warning */}
      {backendError && (
        <div className="backend-warning">
          <span className="warning-icon">⚠️</span>
          Using offline mode - some features may be limited
        </div>
      )}

      {/* Enhanced Sidebar */}
      <EnhancedConversationsSidebar
        conversations={conversations}
        selectedConversationId={currentConversation?.id}
        loading={loading}
        onSelectConversation={selectConversation}
        onCreateConversation={createConversation}
        onDeleteConversation={deleteConversation}
      />

      {/* Main Chat Area */}
      <div className={`chat-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <ChatHeader
          currentConversation={currentConversation}
          selectedAgent={selectedAgent}
          agents={agents}
          onAgentChange={setSelectedAgent}
          onSettingsClick={() => setShowSettings(true)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Messages Container */}
        <div className="messages-container">
          {loading && !currentConversation ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              Loading conversations...
            </div>
          ) : !currentConversation ? (
            <div className="empty-messages-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>No conversation selected</h3>
              <p>Select an existing conversation from the sidebar or create a new one to start chatting</p>
              {agents.length > 0 && (
                <button 
                  onClick={createConversation}
                  className="start-chat-btn"
                >
                  Start a new chat
                </button>
              )}
            </div>
          ) : (
            <MessageList
              messages={messages}
              isGeneratingResponse={isGeneratingResponse}
              aiTyping={aiTyping}
              currentTypingText={currentTypingText}
              onCopyMessage={handleCopyMessage}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              onReactToMessage={handleReactToMessage}
              onDownloadFile={handleDownloadFile}
            />
          )}
        </div>

        {/* Input */}
        <div className={!currentConversation ? 'no-conversation' : ''}>
          <ChatInput
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSendMessage={sendMessage}
            disabled={!currentConversation || isGeneratingResponse || !selectedAgent}
            isListening={isListening}
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            onFileUpload={handleFileUpload}
            onFilesChange={handleFilesChange}
            placeholder={
              !currentConversation 
                ? "Select a conversation to start chatting" 
                : !selectedAgent 
                ? "Select an agent to continue"
                : "Type your message..."
            }
            maxFiles={10}
            maxFileSize={100}
            enableImageCompression={true}
            showFileUpload={true}
          />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <AdvancedSettingsModal
          onClose={() => setShowSettings(false)}
          agents={agents}
        />
      )}
    </div>
  );
};

export default ChatPage; 
# Chat API Integration Guide 💬

## 📋 Overview
Complete guide for integrating the Chat API system in DPRO AI Agent. This covers conversation management, message history, agent interactions, and database integration.

## 🗄️ Database Schema for Chat System

### **Chat System Tables (4 tables)**
```sql
-- Main conversation containers
conversations (
  id              INTEGER PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id),
  agent_id        INTEGER REFERENCES agents(id),
  title           VARCHAR(255),
  conversation_type VARCHAR(50) DEFAULT 'chat',
  status          VARCHAR(50) DEFAULT 'active',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP
);

-- Individual chat messages
messages (
  id              INTEGER PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  sender_type     VARCHAR(20), -- 'user' or 'agent'
  sender_id       INTEGER,
  content         TEXT NOT NULL,
  message_type    VARCHAR(50) DEFAULT 'text',
  metadata        JSON,
  created_at      TIMESTAMP DEFAULT NOW(),
  read_at         TIMESTAMP
);

-- Chat performance analytics
chat_analytics (
  id              INTEGER PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  agent_id        INTEGER REFERENCES agents(id),
  user_id         INTEGER REFERENCES users(id),
  response_time   FLOAT,
  message_count   INTEGER,
  satisfaction_rating INTEGER,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- System-wide notifications
notifications (
  id              INTEGER PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id),
  title           VARCHAR(255),
  content         TEXT,
  type            VARCHAR(50),
  priority        VARCHAR(20) DEFAULT 'normal',
  read            BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

## 🔗 Chat API Endpoints

### **Current Status**: ❌ Database Issues (fixable)

```typescript
// Chat API endpoints (currently having database relationship issues)
const chatEndpoints = {
  // Conversation Management
  getConversations: 'GET /chat/conversations',
  createConversation: 'POST /chat/conversations',
  getConversation: 'GET /chat/conversations/{conversation_id}',
  updateConversation: 'PUT /chat/conversations/{conversation_id}',
  deleteConversation: 'DELETE /chat/conversations/{conversation_id}',
  
  // Message Management
  getMessages: 'GET /chat/conversations/{conversation_id}/messages',
  addMessage: 'POST /chat/conversations/{conversation_id}/messages',
  getAIResponse: 'POST /chat/conversations/{conversation_id}/ai-response',
  
  // Analytics & Search
  getChatAnalytics: 'GET /chat/analytics/dashboard',
  getGlobalAnalytics: 'GET /chat/analytics/global',
  searchMessages: 'GET /chat/search'
};

// Current Issue: Status 500 - Database relationship problems
// Fix needed: Conversation-message table relationship correction
```

## 💬 Complete Chat System Implementation

### **1. Chat Service (when API is fixed)**

```typescript
export class ChatService {
  private baseURL = 'http://localhost:8000';
  
  // Get all conversations for current user
  async getConversations(): Promise<ConversationResponse[]> {
    const response = await fetch(`${this.baseURL}/chat/conversations`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return this.handleResponse(response);
  }
  
  // Create new conversation with specific agent
  async createConversation(data: ConversationCreate): Promise<ConversationResponse> {
    const response = await fetch(`${this.baseURL}/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }
  
  // Get conversation details with metadata
  async getConversation(conversationId: number): Promise<ConversationDetailResponse> {
    const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return this.handleResponse(response);
  }
  
  // Get all messages in conversation (complete history)
  async getMessages(conversationId: number): Promise<MessageResponse[]> {
    const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/messages`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return this.handleResponse(response);
  }
  
  // Add user message to conversation
  async addMessage(conversationId: number, content: string): Promise<MessageResponse> {
    const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        content,
        message_type: 'text',
        sender_type: 'user'
      })
    });
    return this.handleResponse(response);
  }
  
  // Get AI agent response
  async getAIResponse(conversationId: number): Promise<MessageResponse> {
    const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/ai-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return this.handleResponse(response);
  }
  
  // Search through all messages
  async searchMessages(query: string): Promise<SearchResult[]> {
    const response = await fetch(`${this.baseURL}/chat/search?q=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return this.handleResponse(response);
  }
}
```

### **2. Chat Interface Component**

```typescript
// Complete chat interface with conversation history
export const ChatInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Load user's conversation history
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const result = await chatService.getConversations();
        if (result.success) {
          setConversations(result.data);
          
          // Auto-select most recent conversation
          if (result.data.length > 0) {
            setActiveConversation(result.data[0].id);
          }
        }
      } catch (error) {
        console.error('Load conversations failed:', error);
      }
    };
    
    loadConversations();
  }, []);
  
  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      const loadMessages = async () => {
        try {
          const result = await chatService.getMessages(activeConversation);
          if (result.success) {
            setMessages(result.data);
          }
        } catch (error) {
          console.error('Load messages failed:', error);
        }
      };
      
      loadMessages();
    }
  }, [activeConversation]);
  
  // Send message and get AI response
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation || loading) return;
    
    setLoading(true);
    try {
      // Add user message
      const userMessage = await chatService.addMessage(activeConversation, messageText);
      if (userMessage.success) {
        setMessages(prev => [...prev, userMessage.data]);
        setMessageText('');
        
        // Get AI response
        const aiResponse = await chatService.getAIResponse(activeConversation);
        if (aiResponse.success) {
          setMessages(prev => [...prev, aiResponse.data]);
        }
      }
    } catch (error) {
      console.error('Send message failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Create new conversation with specific agent
  const handleCreateConversation = async (agentId: number, title: string) => {
    try {
      const result = await chatService.createConversation({
        agent_id: agentId,
        title: title,
        conversation_type: 'chat'
      });
      
      if (result.success) {
        setConversations(prev => [result.data, ...prev]);
        setActiveConversation(result.data.id);
        setMessages([]); // Clear messages for new conversation
      }
    } catch (error) {
      console.error('Create conversation failed:', error);
    }
  };
  
  return (
    <div className="chat-interface">
      {/* Conversations Sidebar */}
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h3>Conversations</h3>
          <button 
            className="new-chat-btn"
            onClick={() => setShowNewChatModal(true)}
          >
            + New Chat
          </button>
        </div>
        
        <div className="conversations-list">
          {conversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`conversation-item ${activeConversation === conversation.id ? 'active' : ''}`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <div className="conversation-title">{conversation.title}</div>
              <div className="conversation-meta">
                <span className="agent-name">Agent: {conversation.agent_name}</span>
                <span className="last-message-time">
                  {formatDate(conversation.last_message_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="chat-area">
        {activeConversation ? (
          <>
            {/* Messages */}
            <div className="messages-container">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender_type === 'user' ? 'user-message' : 'agent-message'}`}
                >
                  <div className="message-content">{message.content}</div>
                  <div className="message-time">{formatTime(message.created_at)}</div>
                </div>
              ))}
              {loading && <TypingIndicator />}
            </div>
            
            {/* Message Input */}
            <div className="message-input-area">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                disabled={loading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading || !messageText.trim()}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            <h3>Select a conversation or start a new one</h3>
          </div>
        )}
      </div>
    </div>
  );
};
```

### **3. Conversation Management**

```typescript
// Individual conversation component
export const ConversationView: React.FC<{ conversationId: number }> = ({ conversationId }) => {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    const loadConversationData = async () => {
      try {
        // Load conversation details
        const conversationResult = await chatService.getConversation(conversationId);
        if (conversationResult.success) {
          setConversation(conversationResult.data);
        }
        
        // Load full message history
        const messagesResult = await chatService.getMessages(conversationId);
        if (messagesResult.success) {
          setMessages(messagesResult.data);
        }
      } catch (error) {
        console.error('Load conversation failed:', error);
      }
    };
    
    loadConversationData();
  }, [conversationId]);
  
  return (
    <div className="conversation-view">
      {conversation && (
        <div className="conversation-header">
          <h2>{conversation.title}</h2>
          <div className="conversation-info">
            <span>Agent: {conversation.agent_name}</span>
            <span>Created: {formatDate(conversation.created_at)}</span>
            <span>Messages: {messages.length}</span>
          </div>
        </div>
      )}
      
      <div className="messages-history">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
```

## 🔍 Search and Analytics

### **Message Search Component**

```typescript
// Search through conversation history
export const MessageSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await chatService.searchMessages(query);
      if (result.success) {
        setResults(result.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="message-search">
      <div className="search-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search in conversations..."
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      <div className="search-results">
        {results.map(result => (
          <div key={result.id} className="search-result">
            <div className="result-conversation">{result.conversation_title}</div>
            <div className="result-content">{result.message_content}</div>
            <div className="result-meta">
              <span>{result.sender_type}</span>
              <span>{formatDate(result.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 📊 Chat Analytics

### **Chat Analytics Dashboard**

```typescript
// Analytics for chat performance
export const ChatAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [personalResult, globalResult] = await Promise.all([
          chatService.getChatAnalytics(),
          chatService.getGlobalAnalytics()
        ]);
        
        if (personalResult.success) setAnalytics(personalResult.data);
        if (globalResult.success) setGlobalStats(globalResult.data);
      } catch (error) {
        console.error('Load analytics failed:', error);
      }
    };
    
    loadAnalytics();
  }, []);
  
  return (
    <div className="chat-analytics">
      <div className="analytics-cards">
        <div className="stat-card">
          <h3>Total Conversations</h3>
          <div className="stat-value">{analytics?.total_conversations || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Messages Sent</h3>
          <div className="stat-value">{analytics?.total_messages || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Avg Response Time</h3>
          <div className="stat-value">{analytics?.avg_response_time || 0}s</div>
        </div>
        <div className="stat-card">
          <h3>Active Agents</h3>
          <div className="stat-value">{analytics?.active_agents || 0}</div>
        </div>
      </div>
      
      <div className="analytics-charts">
        <ConversationTrendsChart data={analytics?.conversation_trends} />
        <AgentPerformanceChart data={analytics?.agent_performance} />
      </div>
    </div>
  );
};
```

## 🛠️ Integration with Child Agents

### **Agent-Specific Conversations**

```typescript
// Create conversation with specific child agent
export const AgentConversationStarter: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  
  useEffect(() => {
    // Load available agents (when agents API is fixed)
    const loadAgents = async () => {
      try {
        const result = await agentsService.getAgents();
        if (result.success) {
          setAgents(result.data);
        }
      } catch (error) {
        console.error('Load agents failed:', error);
      }
    };
    
    loadAgents();
  }, []);
  
  const startConversationWithAgent = async (agent: Agent) => {
    try {
      const conversation = await chatService.createConversation({
        agent_id: agent.id,
        title: `Chat with ${agent.name}`,
        conversation_type: 'agent_chat'
      });
      
      if (conversation.success) {
        // Navigate to new conversation
        navigate(`/chat/conversations/${conversation.data.id}`);
      }
    } catch (error) {
      console.error('Start conversation failed:', error);
    }
  };
  
  return (
    <div className="agent-conversation-starter">
      <h3>Start a conversation with an agent:</h3>
      <div className="agents-grid">
        {agents.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-info">
              <h4>{agent.name}</h4>
              <p>{agent.description}</p>
              <div className="agent-capabilities">
                {agent.capabilities.slice(0, 3).map(cap => (
                  <span key={cap} className="capability-tag">{cap}</span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => startConversationWithAgent(agent)}
              className="start-chat-btn"
            >
              Start Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎯 Key Features Supported

### **✅ When API is Fixed, the system will support:**

1. **Complete Conversation History**
   - All messages saved permanently
   - Conversations organized by agent
   - Search through entire history
   - Export conversation transcripts

2. **Agent-Specific Conversations**
   - Each child agent gets separate conversations
   - Agent context maintained throughout conversation
   - Agent performance tracking per conversation

3. **Real-time Features**
   - Live message updates
   - Typing indicators
   - Read receipts
   - Push notifications

4. **Analytics & Insights**
   - Conversation performance metrics
   - Agent response quality tracking
   - User engagement analytics
   - System-wide chat statistics

5. **Advanced Features**
   - Message search and filtering
   - Conversation sharing
   - Message reactions and feedback
   - File attachments and media

## 🔧 Database Optimization Needed

### **Current Issues to Fix:**
1. **Conversation-Message Relationship** - Foreign key constraints
2. **Agent-Conversation Linking** - Proper agent referencing
3. **User Analytics Integration** - Activity tracking
4. **Performance Indexing** - Query optimization

### **Once Fixed:**
- All conversation history preserved
- Fast message retrieval
- Real-time conversation updates
- Complete analytics and reporting

---

**🚀 The Chat API will provide comprehensive conversation management with complete history, agent interactions, and real-time capabilities once the database relationships are fixed!**

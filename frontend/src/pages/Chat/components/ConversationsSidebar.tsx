/**
 * ===============================
 * 📋 CONVERSATIONS SIDEBAR COMPONENT
 * ===============================
 * 
 * This component handles conversation list, search, folders, and organization.
 * 
 * 🔧 WHERE TO ADD NEW FEATURES:
 * 
 * 1. 🔍 ADVANCED SEARCH (TASK-004):
 *    - Location: Line ~60-80 (search input area)
 *    - Enhance with: <AdvancedSearchModal filters={searchFilters} />
 *    - Required packages: fuse.js react-highlight-words
 *    - Features to add:
 *      - Search by content, date, agent, tags
 *      - Saved searches
 *      - Search history
 *      - Search suggestions
 *    - Files to create:
 *      - components/AdvancedSearch.tsx
 *      - components/SearchFilters.tsx
 *      - components/SearchResults.tsx
 *      - hooks/useSearch.ts
 *      - utils/searchUtils.ts
 * 
 * 2. 📁 CHAT FOLDERS SYSTEM (TASK-005):
 *    - Location: Line ~100-120 (conversation list)
 *    - Add: <FolderTree folders={folders} onFolderSelect={handleFolderSelect} />
 *    - Required packages: @dnd-kit/core react-sortable-hoc
 *    - Features to add:
 *      - Nested folders
 *      - Drag & drop conversations
 *      - Folder creation/deletion
 *      - Folder sharing
 *      - Smart folders (auto-categorization)
 *    - Files to create:
 *      - components/FolderTree.tsx
 *      - components/FolderItem.tsx
 *      - components/CreateFolderModal.tsx
 *      - hooks/useFolders.ts
 * 
 * 3. 📌 PINNED CONVERSATIONS:
 *    - Location: Line ~100 (before regular conversation list)
 *    - Add: <PinnedConversations pinned={pinnedChats} />
 *    - Features to add:
 *      - Pin/unpin functionality
 *      - Reorder pinned chats
 *      - Pin limit (e.g., max 10)
 *    - Files to create:
 *      - components/PinnedConversations.tsx
 * 
 * 4. 🗂️ CONVERSATION TAGS:
 *    - Location: Line ~120-140 (conversation item)
 *    - Add: <ConversationTags tags={conversation.tags} />
 *    - Features to add:
 *      - Tag creation/management
 *      - Tag-based filtering
 *      - Tag autocomplete
 *      - Color-coded tags
 *    - Files to create:
 *      - components/ConversationTags.tsx
 *      - components/TagManager.tsx
 *      - hooks/useTags.ts
 * 
 * 5. 📊 CONVERSATION ANALYTICS:
 *    - Location: Line ~120-140 (conversation item)
 *    - Add conversation stats: messages count, last activity, tokens used
 *    - Features to add:
 *      - Message count
 *      - Last activity indicator
 *      - Conversation health (activity level)
 *      - Token usage stats
 *    - Files to create:
 *      - components/ConversationStats.tsx
 * 
 * 6. 📤 BULK OPERATIONS:
 *    - Location: Line ~80-100 (top toolbar area)
 *    - Add: <BulkActions selectedChats={selectedChats} />
 *    - Features to add:
 *      - Multi-select conversations
 *      - Bulk delete/archive/export
 *      - Bulk tag assignment
 *      - Bulk folder assignment
 *    - Files to create:
 *      - components/BulkActions.tsx
 *      - hooks/useBulkSelection.ts
 * 
 * 7. 🔄 REAL-TIME UPDATES:
 *    - Location: Line ~30-50 (component initialization)
 *    - Add WebSocket connection for live updates
 *    - Features to add:
 *      - Live message indicators
 *      - New conversation notifications
 *      - Typing indicators
 *      - Online/offline status
 *    - Files to create:
 *      - hooks/useRealtimeUpdates.ts
 * 
 * 8. 📥 IMPORT/EXPORT:
 *    - Location: Line ~80-100 (top toolbar area)
 *    - Add: <ImportExportMenu />
 *    - Features to add:
 *      - Export conversations (JSON, CSV, PDF)
 *      - Import from other platforms
 *      - Backup/restore functionality
 *    - Files to create:
 *      - components/ImportExportMenu.tsx
 *      - utils/exportUtils.ts
 *      - utils/importUtils.ts
 * 
 * 9. 🎨 CUSTOMIZATION:
 *    - Location: Line ~30-50 (component state)
 *    - Add sidebar customization options
 *    - Features to add:
 *      - Sidebar width adjustment
 *      - Compact/detailed view modes
 *      - Custom sorting options
 *      - Hide/show different sections
 *    - Files to create:
 *      - components/SidebarSettings.tsx
 *      - hooks/useSidebarPreferences.ts
 * 
 * 10. 🔔 NOTIFICATIONS:
 *     - Location: Line ~120-140 (conversation item)
 *     - Add notification badges and settings
 *     - Features to add:
 *       - Unread message counts
 *       - Notification settings per chat
 *       - Mention indicators
 *       - Priority levels
 *     - Files to create:
 *       - components/NotificationBadge.tsx
 *       - components/NotificationSettings.tsx
 * 
 * 💡 COMPONENT ARCHITECTURE:
 * 
 * Current Structure:
 * ├── ConversationsSidebar.tsx (THIS FILE) - Basic list
 * 
 * Future Structure:
 * ├── ConversationsSidebar.tsx (Container) - Main layout
 * ├── SidebarHeader.tsx - Search, filters, actions
 * ├── FolderTree.tsx - Folder navigation
 * ├── PinnedConversations.tsx - Pinned chats
 * ├── ConversationList.tsx - Main conversation list
 * ├── ConversationItem.tsx - Individual chat item
 * ├── BulkActions.tsx - Multi-select operations
 * ├── AdvancedSearch.tsx - Advanced search modal
 * └── utils/
 *     ├── searchUtils.ts - Search functionality
 *     ├── folderUtils.ts - Folder management
 *     └── sortUtils.ts - Sorting algorithms
 * 
 * 🚨 DESIGN PRINCIPLES:
 * - Keep the sidebar responsive and performant
 * - Use virtual scrolling for large conversation lists
 * - Implement proper keyboard navigation
 * - Add loading states and error handling
 * - Support drag & drop interactions
 * - Maintain clean visual hierarchy
 * 
 * 📱 MOBILE CONSIDERATIONS:
 * - Collapsible sidebar on mobile
 * - Touch-friendly interactions
 * - Swipe gestures
 * - Simplified view modes
 * 
 * ===============================
 */

import React, { useState } from 'react';
import type { Conversation } from '../types';

interface ConversationsSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isLoading: boolean;
  collapsed: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onCreateConversation: () => void; // Simplified signature
  onDeleteConversation: (conversationId: string) => void;
  onToggleCollapse: () => void;
}

export const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({
  conversations,
  selectedConversation,
  isLoading,
  collapsed,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(conversationId);
    }
    setShowMenu(null);
  };

  if (collapsed) {
    return (
      <div className="conversations-sidebar collapsed">
        <button 
          onClick={onToggleCollapse}
          className="expand-button"
          title="Expand sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <button 
          onClick={onCreateConversation}
          className="new-chat-button collapsed"
          title="New chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        {/* Show mini conversation indicators */}
        <div className="conversations-list">
          {conversations.slice(0, 5).map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${
                selectedConversation?.id === conversation.id ? 'selected' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
              title={conversation.title}
            >
              <div className="conversation-indicator">
                {conversation.is_pinned && (
                  <div className="pin-indicator" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="conversations-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="header-top">
          <button 
            onClick={onToggleCollapse}
            className="collapse-button"
            title="Collapse sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <button 
            onClick={onCreateConversation}
            className="new-chat-button"
            title="New chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="search-container">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Conversations count */}
        {!isLoading && conversations.length > 0 && (
          <div className="conversations-count">
            {filteredConversations.length} of {conversations.length} conversations
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="conversations-list">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-skeleton">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-subtitle"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? (
              <>
                <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>No conversations found</p>
                <p className="empty-subtitle">Try a different search term or clear the search</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search-button"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No conversations yet</p>
                <p className="empty-subtitle">Start a new chat to begin your AI conversation</p>
                <button 
                  onClick={onCreateConversation}
                  className="new-chat-button"
                  style={{ marginTop: 'var(--spacing-md)', fontSize: '12px', padding: '8px 16px' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Chat
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${
                  selectedConversation?.id === conversation.id ? 'selected' : ''
                } ${conversation.is_pinned ? 'pinned' : ''}`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h3 className="conversation-title">
                      {conversation.is_pinned && (
                        <svg className="pin-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5.34l-.894 3.578A1 1 0 019.806 14H4a1 1 0 01-.447-1.894L8 10V5z" clipRule="evenodd" />
                        </svg>
                      )}
                      {conversation.title}
                    </h3>
                    
                    <div className="conversation-actions">
                      <button
                        className="menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(showMenu === conversation.id ? null : conversation.id);
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {showMenu === conversation.id && (
                        <div className="context-menu">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement pin/unpin functionality
                              setShowMenu(null);
                            }}
                            className="menu-item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5.34l-.894 3.578A1 1 0 019.806 14H4a1 1 0 01-.447-1.894L8 10V5z" />
                            </svg>
                            {conversation.is_pinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button 
                            onClick={(e) => handleDeleteClick(e, conversation.id)}
                            className="menu-item delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="conversation-meta">
                    <span className="message-count">
                      {conversation.message_count ? `${conversation.message_count} messages` : 'No messages'}
                    </span>
                    <span className="last-activity">
                      {formatTime(conversation.last_message_at || conversation.updated_at)}
                    </span>
                  </div>
                  
                  {conversation.agent_name && (
                    <div className="agent-info">
                      <svg className="agent-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="agent-name">{conversation.agent_name}</span>
                      <div className="agent-status online" title="Agent is active"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Load More Button (Future Enhancement) */}
            {conversations.length > 10 && filteredConversations.length >= 10 && (
              <div className="load-more-container">
                <button className="load-more-button">
                  Load More Conversations
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="menu-overlay"
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
}; 
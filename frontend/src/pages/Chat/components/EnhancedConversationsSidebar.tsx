import React, { useState, useEffect, useRef } from 'react';
import type { Conversation } from '../types';

// Icons (placeholder - you can replace with your icon system)
const Icons = {
  Plus: () => <span>➕</span>,
  Search: () => <span>🔍</span>,
  Folder: () => <span>📁</span>,
  Pin: () => <span>📌</span>,
  Archive: () => <span>📦</span>,
  MoreHorizontal: () => <span>⋯</span>,
  ChevronDown: () => <span>▼</span>,
  ChevronRight: () => <span>▶</span>,
  Star: () => <span>⭐</span>,
  Calendar: () => <span>📅</span>,
  User: () => <span>👤</span>,
  Bot: () => <span>🤖</span>,
};

interface EnhancedConversationsSidebarProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  selectedConversationId?: string;
  loading?: boolean;
}

// Mock data for enhanced features (until backend is ready)
const mockFolders = [
  { id: '1', name: 'Work Projects', icon: '💼', count: 5, isExpanded: true },
  { id: '2', name: 'Personal', icon: '🏠', count: 3, isExpanded: true },
  { id: '3', name: 'Research', icon: '🔬', count: 7, isExpanded: false },
];

const mockPinnedConversations = [
  { id: 'pinned-1', title: 'Important Client Discussion', lastMessage: '2 hours ago', isPinned: true },
  { id: 'pinned-2', title: 'Project Planning', lastMessage: '1 day ago', isPinned: true },
];



export const EnhancedConversationsSidebar: React.FC<EnhancedConversationsSidebarProps> = ({
  conversations,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  selectedConversationId,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; conversationId: string } | null>(null);
  const [folders, setFolders] = useState(mockFolders);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter conversations based on search and folder
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         searchQuery === '';
    const matchesFolder = selectedFolder ? conv.folder_id === selectedFolder : true;
    return matchesSearch && matchesFolder;
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape to clear search
      if (e.key === 'Escape' && isSearchFocused) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, conversationId });
  };

  // Close context menu
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  const toggleFolder = (folderId: string) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId 
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    ));
  };

  return (
    <div className="enhanced-sidebar">
      {/* Header with New Chat Button */}
      <div className="sidebar-header">
        <button 
          className="new-chat-button"
          onClick={onCreateConversation}
          title="New Chat (Ctrl+Shift+O)"
        >
          <div className="new-chat-content">
            <div className="new-chat-icon">
              <Icons.Plus />
            </div>
            <span className="new-chat-text">New Chat</span>
          </div>
          <Icons.Plus />
        </button>
      </div>

      {/* Search Bar */}
      <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
        <div className="search-input-wrapper">
          <Icons.Search />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search conversations... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
        {isSearchFocused && (
          <div className="search-suggestions">
            <div className="search-suggestion-item">
              <Icons.Calendar />
              <span>Search by date</span>
            </div>
            <div className="search-suggestion-item">
              <Icons.User />
              <span>Search by participant</span>
            </div>
          </div>
        )}
      </div>

      {/* Pinned Conversations */}
      {mockPinnedConversations.length > 0 && (
        <div className="pinned-section">
          <div className="section-header">
            <Icons.Pin />
            <span>Pinned</span>
            <span className="count">{mockPinnedConversations.length}</span>
          </div>
          <div className="pinned-conversations">
            {mockPinnedConversations.map((conv) => (
              <div key={conv.id} className="conversation-item pinned">
                <div className="conversation-icon">
                  <Icons.Star />
                </div>
                <div className="conversation-content">
                  <div className="conversation-title">{conv.title}</div>
                  <div className="conversation-meta">{conv.lastMessage}</div>
                </div>
                <div className="conversation-actions">
                  <button className="action-button">
                    <Icons.MoreHorizontal />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Folders and Conversations */}
      <div className="conversations-section">
        <div className="section-header">
          <Icons.Folder />
          <span>Conversations</span>
          <span className="count">{filteredConversations.length}</span>
        </div>

        {/* Folders */}
        {folders.map((folder) => (
          <div key={folder.id} className="folder-container">
            <div 
              className={`folder-header ${selectedFolder === folder.id ? 'selected' : ''}`}
              onClick={() => {
                toggleFolder(folder.id);
                setSelectedFolder(selectedFolder === folder.id ? null : folder.id);
              }}
            >
              <div className="folder-toggle">
                {folder.isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
              </div>
              <div className="folder-icon">{folder.icon}</div>
              <span className="folder-name">{folder.name}</span>
              <span className="folder-count">{folder.count}</span>
            </div>
            
            {folder.isExpanded && (
              <div className="folder-conversations">
                                 {filteredConversations
                   .filter(conv => conv.folder_id === folder.id)
                   .map((conversation) => (
                     <ConversationItem
                       key={conversation.id}
                       conversation={conversation}
                       isSelected={selectedConversationId === conversation.id}
                       onSelect={() => onSelectConversation(conversation)}
                       onContextMenu={(e) => handleContextMenu(e, conversation.id)}
                     />
                   ))}
              </div>
            )}
          </div>
        ))}

        {/* Uncategorized Conversations */}
        <div className="uncategorized-conversations">
                   {filteredConversations
           .filter(conv => !conv.folder_id)
           .map((conversation) => (
             <ConversationItem
               key={conversation.id}
               conversation={conversation}
               isSelected={selectedConversationId === conversation.id}
               onSelect={() => onSelectConversation(conversation)}
               onContextMenu={(e) => handleContextMenu(e, conversation.id)}
             />
           ))}
        </div>

        {/* Empty State */}
        {filteredConversations.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-title">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </div>
            <div className="empty-state-description">
              {searchQuery 
                ? `Try a different search term`
                : 'Start a new conversation to get started'
              }
            </div>
            {!searchQuery && (
              <button className="empty-state-button" onClick={onCreateConversation}>
                <Icons.Plus />
                New Conversation
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-skeleton">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-subtitle"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          conversationId={contextMenu.conversationId}
          onClose={() => setContextMenu(null)}
          onPin={() => console.log('Pin conversation')}
          onArchive={() => console.log('Archive conversation')}
          onDelete={() => onDeleteConversation(contextMenu.conversationId)}
          onAddToFolder={() => console.log('Add to folder')}
        />
      )}
    </div>
  );
};

// Individual Conversation Item Component
interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onContextMenu,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`conversation-item ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="conversation-avatar">
        {conversation.agent_id ? <Icons.Bot /> : <Icons.User />}
      </div>
      
      <div className="conversation-content">
        <div className="conversation-title">
          {conversation.title || 'New Conversation'}
          {conversation.is_pinned && <Icons.Pin />}
        </div>
        <div className="conversation-meta">
          <span className="conversation-date">
            {formatDate(conversation.updated_at || conversation.created_at)}
          </span>
          {conversation.message_count && (
            <span className="conversation-count">
              {conversation.message_count} messages
            </span>
          )}
        </div>
      </div>

      <div className={`conversation-actions ${isHovered ? 'visible' : ''}`}>
        <button 
          className="action-button"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e);
          }}
          title="More options"
        >
          <Icons.MoreHorizontal />
        </button>
      </div>
    </div>
  );
};

// Context Menu Component
interface ContextMenuProps {
  x: number;
  y: number;
  conversationId: string;
  onClose: () => void;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onAddToFolder: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x, y, conversationId, onClose, onPin, onArchive, onDelete, onAddToFolder
}) => {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div 
      className="context-menu"
      style={{ left: x, top: y }}
      data-conversation-id={conversationId}
    >
      <div className="context-menu-item" onClick={() => handleAction(onPin)}>
        <Icons.Pin />
        <span>Pin Conversation</span>
      </div>
      <div className="context-menu-item" onClick={() => handleAction(onAddToFolder)}>
        <Icons.Folder />
        <span>Move to Folder</span>
      </div>
      <div className="context-menu-separator"></div>
      <div className="context-menu-item" onClick={() => handleAction(onArchive)}>
        <Icons.Archive />
        <span>Archive</span>
      </div>
      <div className="context-menu-item danger" onClick={() => handleAction(onDelete)}>
        <span>🗑️</span>
        <span>Delete</span>
      </div>
    </div>
  );
};

export default EnhancedConversationsSidebar; 
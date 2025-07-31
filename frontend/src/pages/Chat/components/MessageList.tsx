/**
 * ===============================
 * 💬 MESSAGE LIST COMPONENT
 * ===============================
 * 
 * This component handles message display, rendering, and interactions.
 * Enhanced with comprehensive message type support using MessageRenderer.
 * 
 * ✅ IMPLEMENTED FEATURES:
 * - Rich message rendering (text, code, files, images, audio, video, etc.)
 * - Message reactions and interactions
 * - File attachments display
 * - Metadata and token usage
 * - Enhanced typing indicators
 * - Message actions (copy, edit, delete, react)
 * 
 * 🔧 INTEGRATION STATUS:
 * - ✅ MessageRenderer integration complete
 * - ✅ Enhanced message types support
 * - ✅ Legacy message compatibility
 * - ✅ Professional styling
 * 
 * ===============================
 */

import React, { useEffect, useRef } from 'react';
import { ChatIcons } from './Icons';
import MessageRenderer from './MessageRenderer';
import type { Message, LegacyMessage } from '../types';
import { convertLegacyMessage } from '../types';

interface MessageListProps {
  messages: (Message | LegacyMessage)[];
  isGeneratingResponse: boolean;
  aiTyping: boolean;
  currentTypingText: string;
  onCopyMessage: (content: string) => void;
  onEditMessage?: (messageId: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
  onDownloadFile?: (url: string, filename: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isGeneratingResponse,
  aiTyping,
  currentTypingText,
  onCopyMessage,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  onDownloadFile
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTypingText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopyMessage(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Helper function to check if message is legacy format
  const isLegacyMessage = (message: Message | LegacyMessage): message is LegacyMessage => {
    return typeof (message as LegacyMessage).content === 'string' && 
           !(message as Message).content?.type;
  };

  // Convert legacy message to new format
  const normalizeMessage = (message: Message | LegacyMessage): Message => {
    if (isLegacyMessage(message)) {
      return convertLegacyMessage(message);
    }
    return message as Message;
  };

  // Extract content text for copying
  const getMessageTextContent = (message: Message): string => {
    if (!message.content) return '';
    
    switch (message.content.type) {
      case 'text':
        return message.content.text;
      case 'code':
        return message.content.code;
      case 'file':
        return `File: ${message.content.filename}`;
      case 'image':
        return `Image: ${message.content.filename}`;
      case 'audio':
        return message.content.transcription || `Audio: ${message.content.filename}`;
      case 'video':
        return `Video: ${message.content.filename}`;
      case 'math':
        return message.content.latex;
      case 'diagram':
        return message.content.code;
      case 'system':
        return message.content.message;
      case 'error':
        return message.content.error;
      case 'loading':
        return message.content.message;
      default:
        return message.rawContent || 'Unknown content type';
    }
  };

  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ChatIcons.MessageSquare />
          </div>
          <h3>Start a conversation</h3>
          <p>Send a message to begin chatting with your AI assistant</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((rawMessage) => {
            const message = normalizeMessage(rawMessage);
            
            return (
              <div
                key={message.id}
                className={`message ${message.sender_type === 'user' ? 'user-message' : 'assistant-message'} ${message.status === 'sending' ? 'sending' : ''} ${message.status === 'error' ? 'error' : ''}`}
              >
                <div className="message-avatar">
                  {message.sender_type === 'user' ? (
                    <div className="user-avatar">
                      <span>U</span>
                    </div>
                  ) : (
                    <div className="bot-avatar">
                      <ChatIcons.Bot />
                    </div>
                  )}
                </div>
                
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">
                      {typeof message.sender_name === 'string' 
                        ? message.sender_name 
                        : String(message.sender_name || 'Unknown')
                      }
                    </span>
                    <span className="message-time">
                      {message.created_at ? formatTime(String(message.created_at)) : 'Unknown time'}
                    </span>
                    {message.status === 'sending' && (
                      <span className="message-status sending">
                        Sending...
                      </span>
                    )}
                    {message.status === 'error' && (
                      <span className="message-status error">
                        Failed
                      </span>
                    )}
                    {message.isStreaming && (
                      <span className="message-status streaming">
                        Streaming...
                      </span>
                    )}
                  </div>
                  
                  {/* Enhanced Message Rendering */}
                  <MessageRenderer
                    message={message}
                    className="enhanced-message-content"
                    onEdit={onEditMessage}
                    onDelete={onDeleteMessage}
                    onReact={onReactToMessage}
                    onCopy={(content) => copyToClipboard(content)}
                    onDownload={onDownloadFile}
                  />
                  
                  {/* Message Actions */}
                  {message.sender_type === 'agent' && (
                    <div className="message-actions">
                      <button
                        className="action-btn"
                        onClick={() => copyToClipboard(getMessageTextContent(message))}
                        title="Copy message"
                      >
                        <ChatIcons.Copy />
                      </button>
                      
                      {onEditMessage && (
                        <button
                          className="action-btn"
                          onClick={() => onEditMessage(message.id)}
                          title="Edit message"
                        >
                          <ChatIcons.Edit />
                        </button>
                      )}
                      
                                             {onDeleteMessage && (
                         <button
                           className="action-btn"
                           onClick={() => onDeleteMessage(message.id)}
                           title="Delete message"
                         >
                           <ChatIcons.Trash2 />
                         </button>
                       )}
                      
                      {onReactToMessage && (
                        <button
                          className="action-btn"
                          onClick={() => onReactToMessage(message.id, '👍')}
                          title="React to message"
                        >
                          <ChatIcons.Heart />
                        </button>
                      )}
                      
                      {/* Message Statistics */}
                      {(message.metadata?.totalTokens || message.metadata?.processingTime) && (
                        <span className="message-stats">
                          {message.metadata.totalTokens && `${message.metadata.totalTokens} tokens`}
                          {message.metadata.processingTime && 
                            `${message.metadata.totalTokens ? ' • ' : ''}${message.metadata.processingTime}ms`
                          }
                          {message.metadata.modelUsed && 
                            ` • ${message.metadata.modelUsed}`
                          }
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Thread Replies Indicator */}
                  {message.reply_count && message.reply_count > 0 && (
                    <div className="thread-indicator">
                      <button className="thread-button">
                        <ChatIcons.MessageSquare />
                        <span>{message.reply_count} {message.reply_count === 1 ? 'reply' : 'replies'}</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Bookmarked/Pinned Indicators */}
                  {(message.bookmarked || message.pinned) && (
                    <div className="message-indicators">
                      {message.bookmarked && (
                        <span className="indicator bookmarked" title="Bookmarked">
                          <ChatIcons.Bookmark />
                        </span>
                      )}
                      {message.pinned && (
                        <span className="indicator pinned" title="Pinned">
                          <ChatIcons.Pin />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          {(isGeneratingResponse || aiTyping) && (
            <div className="message assistant-message typing-message">
              <div className="message-avatar">
                <div className="bot-avatar">
                  <ChatIcons.Bot />
                </div>
              </div>
              
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">Assistant</span>
                  <span className="typing-indicator">typing...</span>
                </div>
                
                <div className="message-text">
                  {currentTypingText && (
                    <span className="typing-text">{currentTypingText}</span>
                  )}
                  
                  {!currentTypingText && (
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 
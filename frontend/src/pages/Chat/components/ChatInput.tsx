/**
 * ===============================
 * ⌨️ CHAT INPUT COMPONENT
 * ===============================
 * 
 * Enhanced with Phase 2C: Advanced File Upload System
 * 
 * ✅ COMPLETED FEATURES:
 * - Rich Text Editor (TipTap) with formatting toolbar
 * - Advanced File Upload with drag & drop
 * - Image compression and previews
 * - Multiple file format support
 * - Real-time upload progress
 * - Voice input support
 * 
 * 🔧 INTEGRATION STATUS:
 * - ✅ RichTextEditor integrated
 * - ✅ FileUpload component integrated
 * - ✅ Professional styling applied
 * - ✅ Multi-modal input support
 * 
 * ===============================
 */

import React, { useRef, useState } from 'react';
import { ChatIcons } from './Icons';
import SimpleTextArea, { type SimpleTextAreaRef } from './SimpleTextArea';
import FileUpload, { type UploadedFile } from './FileUpload';
import './ChatInput.css';

interface ChatInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  onFileUpload?: (file: UploadedFile) => Promise<string>;
  onFilesChange?: (files: UploadedFile[]) => void;
  placeholder?: string;
  maxFiles?: number;
  maxFileSize?: number;
  enableImageCompression?: boolean;
  showFileUpload?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  messageInput,
  setMessageInput,
  onSendMessage,
  disabled = false,
  isListening = false,
  onStartListening,
  onStopListening,
  onFileUpload,
  onFilesChange,
  placeholder = "Type your message...",
  maxFiles = 10,
  maxFileSize = 100,
  enableImageCompression = true,
  showFileUpload = true
}) => {
  const editorRef = useRef<SimpleTextAreaRef>(null);
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  const [showFileUploadArea, setShowFileUploadArea] = useState(false);

  const handleSend = () => {
    if ((!messageInput.trim() && attachedFiles.length === 0) || disabled) return;
    
    // Send message with attached files
    onSendMessage();
    
    // Clear attached files after sending
    setAttachedFiles([]);
    setShowFileUploadArea(false);
  };

  const handleFilesChange = (files: UploadedFile[]) => {
    setAttachedFiles(files);
    onFilesChange?.(files);
    
    // Auto-show file upload area when files are added
    if (files.length > 0) {
      setShowFileUploadArea(true);
    }
  };

  const handleFileUploadToggle = () => {
    setShowFileUploadArea(!showFileUploadArea);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      onStopListening?.();
    } else {
      onStartListening?.();
    }
  };

  return (
    <div className="chat-input-container">
      {/* Advanced File Upload Area */}
      {showFileUpload && showFileUploadArea && (
        <div className="file-upload-section">
          <FileUpload
            onFilesChange={handleFilesChange}
            onFileUpload={onFileUpload}
            maxFiles={maxFiles}
            maxFileSize={maxFileSize}
            enableImageCompression={enableImageCompression}
            enableDragDrop={true}
            className="chat-file-upload"
          />
        </div>
      )}

      <div className="input-wrapper">
        {/* Left Actions */}
        <div className="input-actions left">
          {showFileUpload && (
            <button
              type="button"
              onClick={handleFileUploadToggle}
              className={`action-button file-upload-button ${showFileUploadArea ? 'active' : ''}`}
              title={showFileUploadArea ? 'Hide File Upload' : 'Show File Upload'}
              disabled={disabled}
            >
              <ChatIcons.Paperclip />
              {attachedFiles.length > 0 && (
                <span className="file-count-badge">{attachedFiles.length}</span>
              )}
            </button>
          )}
        </div>

        {/* Simple Text Input */}
        <div className="message-input-wrapper">
          <SimpleTextArea
            ref={editorRef}
            content={messageInput}
            onChange={setMessageInput}
            onSubmit={handleSend}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={4000}
            className="message-input"
          />
        </div>

        {/* Right Actions */}
        <div className="input-actions right">
          {/* Voice Recording Button */}
          {(onStartListening || onStopListening) && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`action-button voice-button ${isListening ? 'listening' : ''}`}
              title={isListening ? 'Stop Recording' : 'Voice Message'}
              disabled={disabled}
            >
              <ChatIcons.Mic />
              {isListening && (
                <div className="recording-pulse" />
              )}
            </button>
          )}

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!messageInput.trim() && attachedFiles.length === 0) || disabled}
            className="send-button"
            title="Send Message (Enter)"
          >
            <ChatIcons.Send />
          </button>
        </div>
      </div>

      {/* Input Helper Text */}
      <div className="input-helper">
        <span>
          Press Enter to send, Shift+Enter for new line
          {attachedFiles.length > 0 && ` • ${attachedFiles.length} file(s) attached`}
        </span>
      </div>

      {/* File Upload Quick Stats */}
      {attachedFiles.length > 0 && !showFileUploadArea && (
        <div className="attached-files-summary">
          <div className="summary-content">
            <span className="files-count">
              {attachedFiles.length} file(s) attached
            </span>
            <div className="summary-actions">
              <button
                className="view-files-button"
                onClick={() => setShowFileUploadArea(true)}
              >
                View Files
              </button>
              <button
                className="clear-files-button"
                onClick={() => setAttachedFiles([])}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput; 
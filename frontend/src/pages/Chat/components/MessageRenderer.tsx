import React from 'react';
import type { 
  Message, 
  MessageContent,
  TextContent,
  CodeContent,
  FileContent,
  ImageContent,
  AudioContent,
  VideoContent,
  MathContent,
  DiagramContent,
  SystemContent,
  ErrorContent,
  LoadingContent
} from '../types';
import {
  isTextMessage,
  isCodeMessage,
  isFileMessage,
  isImageMessage,
  isAudioMessage,
  isVideoMessage,
  isMathMessage,
  isDiagramMessage,
  isSystemMessage,
  isErrorMessage,
  isLoadingMessage
} from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';

interface MessageRendererProps {
  message: Message;
  className?: string;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onCopy?: (content: string) => void;
  onDownload?: (url: string, filename: string) => void;
}

// Enhanced Text Message Renderer with Markdown Support
const TextMessageRenderer: React.FC<{ content: TextContent; onLinkClick?: (url: string) => void }> = ({ 
  content, 
  onLinkClick 
}) => {
  // Check if content might be markdown (contains markdown syntax)
  const hasMarkdownSyntax = (text: string): boolean => {
    const markdownPatterns = [
      /\*\*.*\*\*/,      // Bold
      /\*.*\*/,          // Italic
      /`.*`/,            // Inline code
      /```[\s\S]*```/,   // Code blocks
      /^#{1,6}\s/m,      // Headers
      /^\* /m,           // Unordered lists
      /^\d+\. /m,        // Ordered lists
      /\[.*\]\(.*\)/,    // Links
      /^> /m,            // Blockquotes
      /\|.*\|/,          // Tables
      /---/,             // Horizontal rules
    ];
    
    return markdownPatterns.some(pattern => pattern.test(text));
  };

  const shouldUseMarkdown = content.formatted || content.markdown || hasMarkdownSyntax(content.text);

  return (
    <div className="message-text">
      {shouldUseMarkdown ? (
        <MarkdownRenderer
          content={content.markdown || content.text}
          enableMath={true}
          enableMermaid={true}
          enableCodeExecution={false}
          onLinkClick={onLinkClick}
          className="enhanced-text-content"
        />
      ) : (
        <p className="plain-text-content">{content.text}</p>
      )}
    </div>
  );
};

// Enhanced Code Message Renderer with CodeMirror
const CodeMessageRenderer: React.FC<{ content: CodeContent; onCodeExecute?: (code: string, language: string) => void }> = ({ 
  content, 
  onCodeExecute 
}) => {
  return (
    <div className="message-code">
      <CodeBlock
        code={content.code}
        language={content.language}
        filename={content.filename}
        executable={content.executable}
        output={content.output}
        theme="light"
        onExecute={onCodeExecute ? () => onCodeExecute(content.code, content.language) : undefined}
        className="enhanced-code-block"
      />
    </div>
  );
};

// File Message Renderer
const FileMessageRenderer: React.FC<{ content: FileContent }> = ({ content }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype: string): string => {
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word') || mimetype.includes('document')) return '📝';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return '📈';
    if (mimetype.includes('zip') || mimetype.includes('rar')) return '📦';
    return '📎';
  };

  return (
    <div className="message-file">
      <div className="file-preview">
        {content.thumbnail ? (
          <img src={content.thumbnail} alt="File preview" className="file-thumbnail" />
        ) : (
          <div className="file-icon">{getFileIcon(content.mimetype)}</div>
        )}
      </div>
      <div className="file-info">
        <div className="file-name">{content.filename}</div>
        <div className="file-details">
          <span className="file-size">{formatFileSize(content.filesize)}</span>
          <span className="file-type">{content.mimetype}</span>
        </div>
        <div className="file-actions">
          {content.previewUrl && (
            <button className="preview-button">👁️ Preview</button>
          )}
          {content.downloadUrl && (
            <button className="download-button">⬇️ Download</button>
          )}
        </div>
      </div>
    </div>
  );
};

// Image Message Renderer
const ImageMessageRenderer: React.FC<{ content: ImageContent }> = ({ content }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className="message-image">
      {!isLoaded && !hasError && (
        <div className="image-loading">Loading image...</div>
      )}
      {hasError && (
        <div className="image-error">Failed to load image</div>
      )}
      <img
        src={content.url}
        alt={content.alt || content.filename}
        className={`message-image-content ${isLoaded ? 'loaded' : ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px'
        }}
      />
      {content.caption && (
        <div className="image-caption">{content.caption}</div>
      )}
      <div className="image-info">
        <span className="image-filename">{content.filename}</span>
        {content.width && content.height && (
          <span className="image-dimensions">{content.width} × {content.height}</span>
        )}
      </div>
    </div>
  );
};

// Audio Message Renderer
const AudioMessageRenderer: React.FC<{ content: AudioContent }> = ({ content }) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="message-audio">
      <div className="audio-player">
        <audio controls className="audio-element">
          <source src={content.url} type={`audio/${content.format || 'mp3'}`} />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div className="audio-info">
        <div className="audio-filename">{content.filename}</div>
        <div className="audio-duration">{formatDuration(content.duration)}</div>
      </div>
      {content.transcription && (
        <div className="audio-transcription">
          <div className="transcription-header">Transcription:</div>
          <div className="transcription-content">{content.transcription}</div>
        </div>
      )}
    </div>
  );
};

// Video Message Renderer
const VideoMessageRenderer: React.FC<{ content: VideoContent }> = ({ content }) => {
  return (
    <div className="message-video">
      <video
        controls
        className="video-player"
        poster={content.thumbnail}
        style={{ maxWidth: '100%', borderRadius: '8px' }}
      >
        <source src={content.url} type={`video/${content.format || 'mp4'}`} />
        Your browser does not support the video element.
      </video>
      <div className="video-info">
        <span className="video-filename">{content.filename}</span>
        {content.width && content.height && (
          <span className="video-dimensions">{content.width} × {content.height}</span>
        )}
      </div>
    </div>
  );
};

// Math Message Renderer
const MathMessageRenderer: React.FC<{ content: MathContent }> = ({ content }) => {
  // This would integrate with KaTeX in a real implementation
  return (
    <div className="message-math">
      <div className={`math-content ${content.inline ? 'inline' : 'block'}`}>
        {/* Placeholder for KaTeX rendering */}
        <div className="latex-placeholder">
          <code>{content.latex}</code>
        </div>
        {content.rendered && (
          <div className="math-rendered" dangerouslySetInnerHTML={{ __html: content.rendered }} />
        )}
      </div>
    </div>
  );
};

// Enhanced Diagram Message Renderer with Mermaid
const DiagramMessageRenderer: React.FC<{ content: DiagramContent }> = ({ content }) => {
  return (
    <div className="message-diagram">
      <MermaidDiagram
        chart={content.code}
        theme="light"
        className="enhanced-diagram"
        onError={(error) => console.error('Diagram render error:', error)}
      />
    </div>
  );
};

// System Message Renderer
const SystemMessageRenderer: React.FC<{ content: SystemContent }> = ({ content }) => {
  const getIconForLevel = (level: string): string => {
    switch (level) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`message-system level-${content.level}`}>
      <div className="system-icon">{getIconForLevel(content.level)}</div>
      <div className="system-content">
        <div className="system-message">{content.message}</div>
        {content.action && (
          <button className="system-action" onClick={() => content.actionUrl && window.open(content.actionUrl, '_blank')}>
            {content.action}
          </button>
        )}
      </div>
    </div>
  );
};

// Error Message Renderer
const ErrorMessageRenderer: React.FC<{ content: ErrorContent }> = ({ content }) => {
  return (
    <div className="message-error">
      <div className="error-icon">❌</div>
      <div className="error-content">
        <div className="error-message">{content.error}</div>
        {content.code && (
          <div className="error-code">Code: {content.code}</div>
        )}
        {content.details && (
          <details className="error-details">
            <summary>Details</summary>
            <div className="error-details-content">{content.details}</div>
          </details>
        )}
        {content.retryable && (
          <button className="retry-button">🔄 Retry</button>
        )}
      </div>
    </div>
  );
};

// Loading Message Renderer
const LoadingMessageRenderer: React.FC<{ content: LoadingContent }> = ({ content }) => {
  return (
    <div className="message-loading">
      <div className="loading-icon">
        <div className="spinner"></div>
      </div>
      <div className="loading-content">
        <div className="loading-message">{content.message}</div>
        {content.progress !== undefined && (
          <div className="loading-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${content.progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{content.progress}%</span>
          </div>
        )}
        {content.estimatedTime && (
          <div className="loading-eta">
            Estimated time: {Math.ceil(content.estimatedTime / 1000)}s
          </div>
        )}
      </div>
    </div>
  );
};

// Main Message Renderer Component
const MessageRenderer: React.FC<MessageRendererProps> = ({ 
  message, 
  className = '',
  onEdit: _onEdit,
  onDelete: _onDelete,
  onReact: _onReact,
  onCopy: _onCopy,
  onDownload: _onDownload
}) => {
  // Enhanced link handler
  const handleLinkClick = (url: string) => {
    console.log('Link clicked:', url);
    // Could implement custom link handling here
  };

  // Enhanced code execution handler
  const handleCodeExecute = (code: string, language: string) => {
    console.log('Code execution requested:', { code, language });
    // Could implement code execution here
  };

  const renderContent = (content: MessageContent) => {
    if (isTextMessage(content)) {
      return <TextMessageRenderer content={content} onLinkClick={handleLinkClick} />;
    } else if (isCodeMessage(content)) {
      return <CodeMessageRenderer content={content} onCodeExecute={handleCodeExecute} />;
    } else if (isFileMessage(content)) {
      return <FileMessageRenderer content={content} />;
    } else if (isImageMessage(content)) {
      return <ImageMessageRenderer content={content} />;
    } else if (isAudioMessage(content)) {
      return <AudioMessageRenderer content={content} />;
    } else if (isVideoMessage(content)) {
      return <VideoMessageRenderer content={content} />;
    } else if (isMathMessage(content)) {
      return <MathMessageRenderer content={content} />;
    } else if (isDiagramMessage(content)) {
      return <DiagramMessageRenderer content={content} />;
    } else if (isSystemMessage(content)) {
      return <SystemMessageRenderer content={content} />;
    } else if (isErrorMessage(content)) {
      return <ErrorMessageRenderer content={content} />;
    } else if (isLoadingMessage(content)) {
      return <LoadingMessageRenderer content={content} />;
    } else {
      // Fallback for unknown message types
      return (
        <div className="message-unknown">
          <div className="unknown-type">Unknown message type</div>
          <pre>{JSON.stringify(content, null, 2)}</pre>
        </div>
      );
    }
  };

  return (
    <div className={`message-renderer ${className}`}>
      <div className="message-content">
        {renderContent(message.content)}
      </div>
      
      {/* Message Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="message-attachments">
          <div className="attachments-header">Attachments:</div>
          {message.attachments.map((attachment) => (
            <div key={attachment.id} className="attachment-item">
              <span className="attachment-name">{attachment.filename}</span>
              <span className="attachment-size">
                {(attachment.filesize / 1024).toFixed(1)} KB
              </span>
              {attachment.status === 'uploading' && (
                <div className="upload-progress">
                  {attachment.uploadProgress}%
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Message Reactions */}
      {message.reactions && message.reactions.length > 0 && (
        <div className="message-reactions">
          {message.reactions.map((reaction) => (
            <button
              key={reaction.id}
              className={`reaction ${reaction.userReacted ? 'user-reacted' : ''}`}
              onClick={() => onReact?.(message.id, reaction.emoji)}
            >
              {reaction.emoji} {reaction.count}
            </button>
          ))}
        </div>
      )}

      {/* Message Metadata */}
      {message.metadata && (
        <div className="message-metadata">
          {message.metadata.totalTokens && (
            <span className="metadata-tokens">
              {message.metadata.totalTokens} tokens
            </span>
          )}
          {message.metadata.processingTime && (
            <span className="metadata-time">
              {message.metadata.processingTime}ms
            </span>
          )}
          {message.metadata.modelUsed && (
            <span className="metadata-model">
              {message.metadata.modelUsed}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageRenderer; 
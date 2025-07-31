/**
 * ===============================
 * 🔧 CHAT TYPES & INTERFACES
 * ===============================
 *
 * This file contains all TypeScript interfaces and types for the chat system.
 *
 * 🔧 WHERE TO ADD NEW TYPES:
 *
 * 1. 📝 RICH TEXT EDITOR TYPES (TASK-001):
 *    - Location: After Message interface
 *    - Add: RichTextContent, EditorState, FormattingOptions
 *    - Example:
 *      interface RichTextContent {
 *        type: 'rich_text';
 *        html: string;
 *        markdown: string;
 *        plainText: string;
 *      }
 *
 * 2. 📁 FILE ATTACHMENT TYPES (TASK-002):
 *    - Location: After Message interface
 *    - Add: FileAttachment, FileType, FileStatus
 *    - Example:
 *      interface FileAttachment {
 *        id: string;
 *        name: string;
 *        type: FileType;
 *        size: number;
 *        url: string;
 *        thumbnail?: string;
 *        status: 'uploading' | 'uploaded' | 'error';
 *      }
 *
 * 3. 🎵 AUDIO MESSAGE TYPES:
 *    - Location: After Message interface
 *    - Add: AudioMessage, AudioStatus, TranscriptionData
 *    - Example:
 *      interface AudioMessage {
 *        type: 'audio';
 *        audioUrl: string;
 *        duration: number;
 *        transcription?: string;
 *        waveform?: number[];
 *      }
 *
 * 4. 📊 CHART & VISUALIZATION TYPES:
 *    - Location: After Message interface
 *    - Add: ChartData, ChartType, VisualizationConfig
 *    - Example:
 *      interface ChartMessage {
 *        type: 'chart';
 *        chartType: 'bar' | 'line' | 'pie' | 'scatter';
 *        data: any[];
 *        config: ChartConfig;
 *      }
 *
 * 5. 🧮 MATH EQUATION TYPES:
 *    - Location: After Message interface
 *    - Add: MathEquation, LaTeXContent
 *    - Example:
 *      interface MathMessage {
 *        type: 'math';
 *        latex: string;
 *        rendered?: string;
 *        inline: boolean;
 *      }
 *
 * 6. 🗂️ MERMAID DIAGRAM TYPES:
 *    - Location: After Message interface
 *    - Add: DiagramMessage, DiagramType
 *    - Example:
 *      interface DiagramMessage {
 *        type: 'diagram';
 *        diagramType: 'flowchart' | 'sequence' | 'gantt' | 'pie';
 *        code: string;
 *        svg?: string;
 *      }
 *
 * 7. 📁 FOLDER SYSTEM TYPES (TASK-005):
 *    - Location: After Conversation interface
 *    - Add: Folder, FolderTree, FolderPermissions
 *    - Example:
 *      interface Folder {
 *        id: string;
 *        name: string;
 *        parentId?: string;
 *        children?: Folder[];
 *        conversationIds: string[];
 *        color?: string;
 *        icon?: string;
 *      }
 *
 * 8. 🏷️ TAG SYSTEM TYPES:
 *    - Location: After Conversation interface
 *    - Add: Tag, TagCategory, TagFilter
 *    - Example:
 *      interface Tag {
 *        id: string;
 *        name: string;
 *        color: string;
 *        category?: string;
 *        count: number;
 *      }
 *
 * 9. 🔍 SEARCH TYPES (TASK-004):
 *    - Location: After Conversation interface
 *    - Add: SearchQuery, SearchFilter, SearchResult
 *    - Example:
 *      interface SearchQuery {
 *        query: string;
 *        filters: SearchFilter[];
 *        sortBy: 'relevance' | 'date' | 'title';
 *        dateRange?: DateRange;
 *      }
 *
 * 10. ⭐ MESSAGE RATING TYPES:
 *     - Location: After Message interface
 *     - Add: MessageRating, FeedbackType
 *     - Example:
 *       interface MessageRating {
 *         messageId: string;
 *         rating: 1 | 2 | 3 | 4 | 5;
 *         feedback?: string;
 *         type: 'helpful' | 'accurate' | 'creative' | 'safe';
 *       }
 *
 * 11. 🔄 REAL-TIME TYPES:
 *     - Location: After Message interface
 *     - Add: WebSocketEvent, TypingIndicator, UserPresence
 *     - Example:
 *       interface TypingIndicator {
 *         conversationId: string;
 *         userId: string;
 *         isTyping: boolean;
 *         timestamp: string;
 *       }
 *
 * 12. 🔗 CITATION TYPES:
 *     - Location: After Message interface
 *     - Add: Citation, Reference, Source
 *     - Example:
 *       interface Citation {
 *         id: string;
 *         url: string;
 *         title: string;
 *         snippet: string;
 *         type: 'web' | 'document' | 'api' | 'database';
 *       }
 *
 * 💡 TYPE ORGANIZATION GUIDELINES:
 *
 * 1. Core Interfaces (Agent, Conversation, Message) - Keep at the top
 * 2. Extended Message Types - Group by functionality
 * 3. UI Component Types - Keep separate section
 * 4. Utility Types - Keep at the bottom
 * 5. Enums - Define before interfaces that use them
 *
 * 🚨 NAMING CONVENTIONS:
 * - Interfaces: PascalCase (e.g., MessageAttachment)
 * - Types: PascalCase (e.g., MessageType)
 * - Enums: PascalCase (e.g., FileStatus)
 * - Properties: camelCase (e.g., createdAt)
 *
 * 📦 IMPORT/EXPORT GUIDELINES:
 * - Export all interfaces and types
 * - Use 'export type' for type-only exports
 * - Group related exports together
 *
 * ===============================
 */

// ============= CORE INTERFACES =============

export interface Agent {
  id: number;
  name: string;
  model_provider: string;
  model_name: string;
  endpoint_url?: string;
  api_key?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  uuid?: string; // NEW: UUID for ChatGPT-style URLs (/c/{uuid})
  title: string;
  agent_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;

  // Optional extended properties for UI
  conversation_type?: "chat" | "support" | "training" | "analysis";
  status?: "active" | "paused" | "completed" | "archived";
  agent_name?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  message_count?: number;
  last_message_at?: string;
  folder_id?: string; // NEW: Folder organization support
}

// ============= ENHANCED MESSAGE TYPE SYSTEM =============

// Core message types supported by the system
export type MessageType =
  | "text" // Plain text and rich text
  | "code" // Code blocks with syntax highlighting
  | "file" // File attachments (documents, archives, etc.)
  | "image" // Image files with preview
  | "audio" // Audio messages and voice recordings
  | "video" // Video files with player
  | "math" // Mathematical equations with LaTeX
  | "diagram" // Mermaid diagrams and flowcharts
  | "system" // System notifications and status
  | "error" // Error messages and warnings
  | "loading"; // Loading placeholders and progress

// Message content types for different message types
export interface TextContent {
  type: "text";
  text: string;
  html?: string; // Rich text HTML representation
  markdown?: string; // Markdown representation
  formatted?: boolean; // Whether text has formatting
}

export interface CodeContent {
  type: "code";
  code: string;
  language: string;
  filename?: string;
  executable?: boolean;
  output?: string;
}

export interface FileContent {
  type: "file";
  filename: string;
  filesize: number;
  mimetype: string;
  url: string;
  downloadUrl?: string;
  previewUrl?: string;
  thumbnail?: string;
}

export interface ImageContent {
  type: "image";
  url: string;
  filename: string;
  filesize: number;
  width?: number;
  height?: number;
  thumbnail?: string;
  alt?: string;
  caption?: string;
}

export interface AudioContent {
  type: "audio";
  url: string;
  filename: string;
  filesize: number;
  duration: number;
  transcription?: string;
  waveform?: number[];
  format?: string;
}

export interface VideoContent {
  type: "video";
  url: string;
  filename: string;
  filesize: number;
  duration: number;
  width?: number;
  height?: number;
  thumbnail?: string;
  format?: string;
}

export interface MathContent {
  type: "math";
  latex: string;
  rendered?: string;
  inline: boolean;
  displayMode?: boolean;
}

export interface DiagramContent {
  type: "diagram";
  diagramType: "flowchart" | "sequence" | "gantt" | "pie" | "graph" | "mindmap";
  code: string;
  svg?: string;
  title?: string;
}

export interface SystemContent {
  type: "system";
  message: string;
  level: "info" | "warning" | "error" | "success";
  action?: string;
  actionUrl?: string;
}

export interface ErrorContent {
  type: "error";
  error: string;
  code?: string;
  details?: string;
  retryable?: boolean;
}

export interface LoadingContent {
  type: "loading";
  message: string;
  progress?: number;
  estimatedTime?: number;
}

// Union type for all content types
export type MessageContent =
  | TextContent
  | CodeContent
  | FileContent
  | ImageContent
  | AudioContent
  | VideoContent
  | MathContent
  | DiagramContent
  | SystemContent
  | ErrorContent
  | LoadingContent;

// Message attachments
export interface MessageAttachment {
  id: string;
  filename: string;
  filesize: number;
  mimetype: string;
  url: string;
  thumbnail?: string;
  uploadProgress?: number;
  status: "uploading" | "uploaded" | "error" | "processing";
  error?: string;
}

// Message reactions
export interface MessageReaction {
  id: string;
  emoji: string;
  count: number;
  users: string[];
  userReacted?: boolean;
}

// Message metadata
export interface MessageMetadata {
  modelUsed?: string;
  temperature?: number;
  maxTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  processingTime?: number;
  cost?: number;
  reasoning?: string;
  sources?: MessageSource[];
}

// Message sources/citations
export interface MessageSource {
  id: string;
  url: string;
  title: string;
  snippet?: string;
  type: "web" | "document" | "api" | "database" | "file";
  confidence?: number;
}

// Enhanced Message interface
export interface Message {
  id: string;
  conversationId: string;
  content: MessageContent;
  rawContent?: string; // Original content before processing
  sender_type: "user" | "agent" | "system";
  sender_name: string;
  sender_id?: string;

  // Status and timing
  status?: "sending" | "sent" | "delivered" | "read" | "error" | "processing";
  created_at: string;
  updated_at?: string;
  edited_at?: string;

  // Threading and relationships
  parent_id?: string; // For threaded conversations
  thread_id?: string; // Thread identifier
  reply_count?: number; // Number of replies in thread

  // Attachments and media
  attachments?: MessageAttachment[];

  // Interactions
  reactions?: MessageReaction[];
  bookmarked?: boolean;
  pinned?: boolean;

  // Metadata
  metadata?: MessageMetadata;

  // UI state
  isEditing?: boolean;
  isStreaming?: boolean;
  streamingComplete?: boolean;

  // Search and organization
  tags?: string[];
  rating?: number;
  feedback?: string;
}

// Message creation and update types
export interface CreateMessageRequest {
  content: string | MessageContent;
  message_type?: MessageType;
  parent_message_id?: string;
  thread_id?: string;
  attachments?: File[];
  metadata?: Partial<MessageMetadata>;
}

export interface UpdateMessageRequest {
  id: string;
  content?: string | MessageContent;
  reactions?: MessageReaction[];
  bookmarked?: boolean;
  pinned?: boolean;
  tags?: string[];
  rating?: number;
  feedback?: string;
}

export interface SendMessageRequest {
  content: string | MessageContent;
  message_type?: MessageType;
  parent_message_id?: string;
  thread_id?: string;
  attachments?: File[];
  metadata?: Partial<MessageMetadata>;
}

// ============= MESSAGE UTILITIES =============

// Message type guards
export const isTextMessage = (
  content: MessageContent
): content is TextContent => content.type === "text";

export const isCodeMessage = (
  content: MessageContent
): content is CodeContent => content.type === "code";

export const isFileMessage = (
  content: MessageContent
): content is FileContent => content.type === "file";

export const isImageMessage = (
  content: MessageContent
): content is ImageContent => content.type === "image";

export const isAudioMessage = (
  content: MessageContent
): content is AudioContent => content.type === "audio";

export const isVideoMessage = (
  content: MessageContent
): content is VideoContent => content.type === "video";

export const isMathMessage = (
  content: MessageContent
): content is MathContent => content.type === "math";

export const isDiagramMessage = (
  content: MessageContent
): content is DiagramContent => content.type === "diagram";

export const isSystemMessage = (
  content: MessageContent
): content is SystemContent => content.type === "system";

export const isErrorMessage = (
  content: MessageContent
): content is ErrorContent => content.type === "error";

export const isLoadingMessage = (
  content: MessageContent
): content is LoadingContent => content.type === "loading";

// ============= LEGACY COMPATIBILITY =============

// For backward compatibility with existing code
export interface LegacyMessage {
  id: string;
  content: string;
  sender_type: "user" | "agent" | "system";
  sender_name: string;
  message_type?: "text" | "image" | "file" | "code";
  status?: "sending" | "sent" | "delivered" | "read" | "error";
  tokens_used?: number;
  processing_time?: number;
  created_at: string;
  updated_at?: string;
}

// Conversion utilities
export const convertLegacyMessage = (legacy: LegacyMessage): Message => ({
  id: legacy.id,
  conversationId: "", // Will need to be set by caller
  content: {
    type: "text",
    text: legacy.content,
  } as TextContent,
  rawContent: legacy.content,
  sender_type: legacy.sender_type,
  sender_name: legacy.sender_name,
  status: legacy.status,
  created_at: legacy.created_at,
  updated_at: legacy.updated_at,
  metadata:
    legacy.tokens_used || legacy.processing_time
      ? {
          totalTokens: legacy.tokens_used,
          processingTime: legacy.processing_time,
        }
      : undefined,
});

export interface CreateConversationRequest {
  title: string;
  agent_id?: string;
  conversation_type: "chat" | "support" | "training" | "analysis";
}

export interface ChatSettings {
  selectedModel: string;
  temperature: number;
  maxTokens: number;
  autoSave: boolean;
  showTimestamps: boolean;
  enableTypingIndicator: boolean;
}

export interface ConversationFilters {
  search?: string;
  status?: string;
  agent_id?: string;
  conversation_type?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}

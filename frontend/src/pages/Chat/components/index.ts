/**
 * Chat Components Exports
 */

export { ConversationsSidebar } from "./ConversationsSidebar";
export { default as EnhancedConversationsSidebar } from "./EnhancedConversationsSidebar";
export { ChatInterface } from "./ChatInterface";
export { ModelSelector } from "./ModelSelector";
export { ChatSettings } from "./ChatSettings";
export { AgentLoadingStatus } from "./AgentLoadingStatus";

// New Components
export { ChatIcons } from "./Icons";
export { MessageList } from "./MessageList";
export { ChatInput } from "./ChatInput";
export { ChatHeader } from "./ChatHeader";
export { AdvancedSettingsModal } from "./AdvancedSettingsModal";
export { default as RichTextEditor } from "./RichTextEditor";
export { default as MessageRenderer } from "./MessageRenderer"; // Added in Phase 2B
export { default as FileUpload } from "./FileUpload";
export type { UploadedFile } from "./FileUpload";

// Phase 2D: Enhanced Message Rendering Components
export { default as CodeBlock } from "./CodeBlock"; // Advanced code highlighting
export { default as MarkdownRenderer } from "./MarkdownRenderer"; // Enhanced markdown parsing
export { default as MermaidDiagram } from "./MermaidDiagram"; // Diagram rendering

// Theme System
export { default as ThemeToggle } from "./ThemeToggle"; // Light/Dark theme toggle

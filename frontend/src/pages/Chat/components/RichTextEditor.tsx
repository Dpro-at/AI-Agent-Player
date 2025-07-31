/**
 * ===============================
 * 📝 RICH TEXT EDITOR COMPONENT
 * ===============================
 * 
 * Advanced TipTap-based rich text editor for chat messages
 * Replaces the basic textarea with modern editing capabilities
 * 
 * Features:
 * - Rich text formatting (bold, italic, code)
 * - Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)
 * - Placeholder support
 * - Character count
 * - Send on Enter
 * - Multi-line support with Shift+Enter
 * 
 * ===============================
 */

import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

export interface RichTextEditorRef {
  focus: () => void;
  clear: () => void;
  getHTML: () => string;
  getText: () => string;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({
  content,
  onChange,
  onSubmit,
  placeholder = "Type your message...",
  disabled = false,
  maxLength = 4000,
  className = ""
}, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable some features we don't need in chat
        heading: false,
        horizontalRule: false,
        blockquote: false,
        bulletList: true,
        orderedList: true,
        listItem: true,
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono'
          }
        },
        code: {
          HTMLAttributes: {
            class: 'bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono'
          }
        }
      })
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[40px] max-h-[200px] overflow-y-auto p-3 text-gray-900 dark:text-gray-100',
        'data-placeholder': placeholder,
      },
      handleKeyDown: (view, event) => {
        // Send message on Enter (without Shift)
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          onSubmit?.();
          return true;
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editable: !disabled,
  });

  // Expose editor methods to parent component
  useImperativeHandle(ref, () => ({
    focus: () => editor?.commands.focus(),
    clear: () => editor?.commands.clearContent(),
    getHTML: () => editor?.getHTML() || '',
    getText: () => editor?.getText() || '',
  }), [editor]);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const characterCount = editor?.storage.characterCount?.characters() || 0;
  const isOverLimit = maxLength && characterCount > maxLength;

  if (!editor) {
    return (
      <div className={`border border-gray-300 dark:border-gray-600 rounded-lg p-3 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Editor Container */}
      <div className={`
        border border-gray-300 dark:border-gray-600 rounded-lg 
        focus-within:border-blue-500 dark:focus-within:border-blue-400
        ${disabled ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
        ${isOverLimit ? 'border-red-500 dark:border-red-400' : ''}
      `}>


        {/* Editor Content */}
        <EditorContent editor={editor} />

        {/* Character Count */}
        {maxLength && (
          <div className="flex justify-end p-2 text-xs">
            <span className={`
              ${isOverLimit ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
            `}>
              {characterCount}/{maxLength}
            </span>
          </div>
        )}
      </div>


    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

// Toolbar Button Component
interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`
      p-1.5 rounded text-sm transition-colors
      ${isActive 
        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    `}
  >
    {children}
  </button>
);

// Icon Components
const BoldIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 4v3h5.5a1.5 1.5 0 110 3H5v2h5.5a3.5 3.5 0 100-7H5zM3 2h7.5a3.5 3.5 0 012.45 5.95A3.5 3.5 0 0112.5 15H3V2z" clipRule="evenodd" />
  </svg>
);

const ItalicIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 2h6v2l-2 .5L10.5 16H12v2H6v-2l2-.5L9.5 4H8V2z" clipRule="evenodd" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const CodeBlockIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 001.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
  </svg>
);

export default RichTextEditor; 
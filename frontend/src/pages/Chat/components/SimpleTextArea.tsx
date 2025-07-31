/**
 * ===============================
 * 📝 SIMPLE TEXT AREA COMPONENT
 * ===============================
 * 
 * تبديل RichTextEditor المعقد بـ textarea بسيط وفعال
 * 
 * ===============================
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import './SimpleTextArea.css';

interface SimpleTextAreaProps {
  content: string;
  onChange: (content: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

export interface SimpleTextAreaRef {
  focus: () => void;
  clear: () => void;
  getHTML: () => string;
  getText: () => string;
}

const SimpleTextArea = forwardRef<SimpleTextAreaRef, SimpleTextAreaProps>(({
  content,
  onChange,
  onSubmit,
  placeholder = "اكتب رسالتك...",
  disabled = false,
  maxLength = 4000,
  className = ""
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    clear: () => {
      if (textareaRef.current) {
        textareaRef.current.value = '';
        onChange('');
      }
    },
    getHTML: () => content,
    getText: () => content,
  }), [content, onChange]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit?.();
      return;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (maxLength && value.length > maxLength) {
      return; // Don't allow exceeding max length
    }
    onChange(value);
  };

  const characterCount = content.length;
  const isOverLimit = maxLength && characterCount > maxLength;

  return (
    <div className={`simple-textarea-container ${className}`}>
      <div className={`
        simple-textarea-wrapper
        ${disabled ? 'disabled' : ''}
        ${isOverLimit ? 'over-limit' : ''}
      `}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="simple-textarea"
          rows={1}
          style={{
            minHeight: '40px',
            maxHeight: '120px',
            resize: 'none',
            overflow: 'hidden'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
          }}
        />
        
        {/* Character Count */}
        {maxLength && (
          <div className="character-count">
            <span className={isOverLimit ? 'over-limit' : ''}>
              {characterCount}/{maxLength}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

SimpleTextArea.displayName = 'SimpleTextArea';

export default SimpleTextArea;
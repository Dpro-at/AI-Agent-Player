/**
 * ===============================
 * 📝 ENHANCED MARKDOWN RENDERER
 * ===============================
 * 
 * Advanced markdown parsing and rendering with:
 * - GitHub Flavored Markdown support
 * - Math equations (KaTeX)
 * - Syntax highlighting (CodeMirror)
 * - Tables, lists, links
 * - Mermaid diagrams
 * - Custom components
 * 
 * ✅ FEATURES:
 * - react-markdown with remark plugins
 * - KaTeX for mathematical equations
 * - Custom code block rendering
 * - Link handling and security
 * - Table styling
 * - Task lists support
 * 
 * ===============================
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';
import { ChatIcons } from './Icons';

// Import KaTeX CSS
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  enableMath?: boolean;
  enableMermaid?: boolean;
  enableCodeExecution?: boolean;
  theme?: 'light' | 'dark';
  onLinkClick?: (url: string) => void;
  onCodeExecute?: (code: string, language: string) => Promise<string>;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  enableMath = true,
  enableMermaid = true,
  enableCodeExecution = false,
  theme = 'light',
  onLinkClick,
  onCodeExecute
}) => {
  const [executingCode, setExecutingCode] = useState<string | null>(null);

  // Handle code execution
  const handleCodeExecute = async (code: string, language: string) => {
    if (!onCodeExecute || executingCode) return;
    
    setExecutingCode(code);
    try {
      const result = await onCodeExecute(code, language);
      return result;
    } catch (error) {
      console.error('Code execution failed:', error);
      return `Error: ${error}`;
    } finally {
      setExecutingCode(null);
    }
  };

  // Custom components for markdown elements
  const components = {
    // Enhanced code blocks
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      if (!inline && match) {
        // Check if it's a mermaid diagram
        if (enableMermaid && language === 'mermaid') {
          return (
            <MermaidDiagram
              chart={code}
              theme={theme}
              className="markdown-mermaid"
            />
          );
        }

        // Render code block with CodeMirror
        return (
          <CodeBlock
            code={code}
            language={language}
            executable={enableCodeExecution && ['javascript', 'python', 'js', 'py'].includes(language)}
            theme={theme}
            onExecute={enableCodeExecution ? () => handleCodeExecute(code, language) : undefined}
            className="markdown-code-block"
          />
        );
      }

      // Inline code
      return (
        <code className={`inline-code ${className}`} {...props}>
          {children}
        </code>
      );
    },

    // Enhanced links
    a({ href, children, ...props }: any) {
      const handleClick = (e: React.MouseEvent) => {
        if (onLinkClick && href) {
          e.preventDefault();
          onLinkClick(href);
        }
      };

      return (
        <a
          href={href}
          onClick={handleClick}
          className="markdown-link"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
          {href?.startsWith('http') && (
            <ChatIcons.Globe />
          )}
        </a>
      );
    },

    // Enhanced tables
    table({ children, ...props }: any) {
      return (
        <div className="table-container">
          <table className="markdown-table" {...props}>
            {children}
          </table>
        </div>
      );
    },

    // Enhanced blockquotes
    blockquote({ children, ...props }: any) {
      return (
        <blockquote className="markdown-blockquote" {...props}>
          <div className="blockquote-indicator" />
          <div className="blockquote-content">
            {children}
          </div>
        </blockquote>
      );
    },

    // Enhanced headings with anchors
    h1: ({ children, ...props }: any) => (
      <h1 className="markdown-h1" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="markdown-h2" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="markdown-h3" {...props}>
        {children}
      </h3>
    ),

    // Enhanced lists
    ul: ({ children, ...props }: any) => (
      <ul className="markdown-ul" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="markdown-ol" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="markdown-li" {...props}>
        {children}
      </li>
    ),

    // Task lists
    input: ({ type, checked, ...props }: any) => {
      if (type === 'checkbox') {
        return (
          <input
            type="checkbox"
            checked={checked}
            disabled
            className="task-checkbox"
            {...props}
          />
        );
      }
      return <input type={type} {...props} />;
    },

    // Enhanced images
    img: ({ src, alt, ...props }: any) => (
      <div className="markdown-image-container">
        <img
          src={src}
          alt={alt}
          className="markdown-image"
          loading="lazy"
          {...props}
        />
        {alt && <div className="image-caption">{alt}</div>}
      </div>
    ),

    // Enhanced hr
    hr: (props: any) => (
      <div className="markdown-divider" {...props}>
        <hr />
      </div>
    )
  };

  // Configure remark and rehype plugins
  const remarkPlugins = [
    remarkGfm, // GitHub Flavored Markdown
    ...(enableMath ? [remarkMath] : [])
  ];

  const rehypePlugins = [
    rehypeRaw, // Allow HTML in markdown
    ...(enableMath ? [rehypeKatex] : [])
  ];

  return (
    <div className={`markdown-renderer ${theme} ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
        linkTarget="_blank"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 
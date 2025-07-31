/**
 * ===============================
 * 📊 MERMAID DIAGRAM COMPONENT
 * ===============================
 * 
 * Renders Mermaid diagrams and flowcharts with:
 * - Dynamic diagram rendering
 * - Multiple diagram types support
 * - Theme customization
 * - Error handling
 * - Export capabilities
 * 
 * ✅ SUPPORTED DIAGRAMS:
 * - Flowcharts
 * - Sequence diagrams
 * - Gantt charts
 * - Pie charts
 * - Git graphs
 * - User journey
 * - Entity relationship
 * - State diagrams
 * 
 * ===============================
 */

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ChatIcons } from './Icons';

interface MermaidDiagramProps {
  chart: string;
  theme?: 'light' | 'dark';
  className?: string;
  onError?: (error: string) => void;
  onRendered?: () => void;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  theme = 'light',
  className = '',
  onError,
  onRendered
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagramId] = useState(`mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        useMaxWidth: true,
        showSequenceNumbers: true
      },
      gantt: {
        useMaxWidth: true,
        leftPadding: 75,
        gridLineStartPadding: 35
      },
      pie: {
        useMaxWidth: true
      },
      journey: {
        useMaxWidth: true
      },
      gitGraph: {
        useMaxWidth: true,
        showBranches: true,
        showCommitLabel: true
      },
      er: {
        useMaxWidth: true
      },
      state: {
        useMaxWidth: true
      }
    });
  }, [theme]);

  // Render diagram
  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !chart.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Validate and render the diagram
        const isValid = await mermaid.parse(chart);
        if (!isValid) {
          throw new Error('Invalid Mermaid syntax');
        }

        const { svg } = await mermaid.render(diagramId, chart);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Apply additional styling to the SVG
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.display = 'block';
            svgElement.style.margin = '0 auto';
          }
        }

        onRendered?.();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to render diagram';
        setError(errorMessage);
        onError?.(errorMessage);
        console.error('Mermaid rendering error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [chart, diagramId, onError, onRendered]);

  // Copy diagram source
  const handleCopySource = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy diagram source:', error);
    }
  };

  // Export as SVG
  const handleExportSVG = () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `mermaid-diagram-${Date.now()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  // Get diagram type from content
  const getDiagramType = (content: string): string => {
    const firstLine = content.trim().split('\n')[0].toLowerCase();
    
    if (firstLine.includes('graph') || firstLine.includes('flowchart')) return 'Flowchart';
    if (firstLine.includes('sequencediagram')) return 'Sequence';
    if (firstLine.includes('gantt')) return 'Gantt';
    if (firstLine.includes('pie')) return 'Pie Chart';
    if (firstLine.includes('journey')) return 'User Journey';
    if (firstLine.includes('gitgraph')) return 'Git Graph';
    if (firstLine.includes('erdiagram')) return 'Entity Relationship';
    if (firstLine.includes('statediagram')) return 'State Diagram';
    if (firstLine.includes('classDiagram')) return 'Class Diagram';
    
    return 'Diagram';
  };

  if (error) {
    return (
      <div className={`mermaid-diagram error ${className}`}>
        <div className="diagram-header">
          <div className="diagram-info">
            <ChatIcons.Globe />
            <span>Mermaid Diagram (Error)</span>
          </div>
          <div className="diagram-actions">
            <button
              onClick={handleCopySource}
              className="action-button copy-button"
              title="Copy Source"
            >
              <ChatIcons.Copy />
              <span>Copy</span>
            </button>
          </div>
        </div>
        
        <div className="diagram-error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Diagram Rendering Error</h4>
            <p>{error}</p>
            <details className="error-details">
              <summary>View Source Code</summary>
              <pre className="error-source">{chart}</pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mermaid-diagram ${theme} ${className}`}>
      {/* Header */}
      <div className="diagram-header">
        <div className="diagram-info">
          <ChatIcons.Globe />
          <span>{getDiagramType(chart)}</span>
        </div>
        
        <div className="diagram-actions">
          <button
            onClick={handleExportSVG}
            className="action-button export-button"
            title="Export as SVG"
            disabled={isLoading || !!error}
          >
            <ChatIcons.Upload />
            <span>Export</span>
          </button>
          
          <button
            onClick={handleCopySource}
            className="action-button copy-button"
            title="Copy Source"
          >
            <ChatIcons.Copy />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Diagram Container */}
      <div className="diagram-container">
        {isLoading && (
          <div className="diagram-loading">
            <div className="loading-spinner" />
            <span>Rendering diagram...</span>
          </div>
        )}
        
        <div
          ref={containerRef}
          className={`diagram-content ${isLoading ? 'loading' : ''}`}
        />
      </div>

      {/* Source Code (collapsible) */}
      <details className="diagram-source">
        <summary>View Source Code</summary>
        <pre className="source-code">{chart}</pre>
      </details>
    </div>
  );
};

export default MermaidDiagram; 
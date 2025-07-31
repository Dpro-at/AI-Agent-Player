/**
 * ChatHeader Component
 * Header section with conversation title, agent selector, and settings
 */

import React from 'react';
import { ChatIcons } from './Icons';
import type { Conversation, Agent } from '../types';
import ThemeToggle from './ThemeToggle';

interface ChatHeaderProps {
  currentConversation: Conversation | null;
  selectedAgent: Agent | null;
  agents: Agent[];
  onAgentChange: (agent: Agent | null) => void;
  onSettingsClick: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentConversation,
  selectedAgent,
  agents,
  onAgentChange,
  onSettingsClick,
  onToggleSidebar,
  sidebarCollapsed
}) => {
  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agentId = parseInt(e.target.value);
    const agent = agents.find(a => a.id === agentId) || null;
    onAgentChange(agent);
  };

  return (
    <div className="chat-header">
      {/* Left Section */}
      <div className="header-left">
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle"
          title={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
        >
          <ChatIcons.Menu />
        </button>
        
        <div className="conversation-info">
          <h1 className="conversation-title">
            {currentConversation?.title || 'Select a Conversation'}
          </h1>
          <p className="conversation-subtitle">
            {selectedAgent ? (
              <>
                {selectedAgent.name} • {selectedAgent.model_name}
                <span className="provider-badge">{selectedAgent.model_provider}</span>
              </>
            ) : (
              'No agent selected'
            )}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Agent Selector */}
        <div className="agent-selector-container">
          <select
            value={selectedAgent?.id || ''}
            onChange={handleAgentChange}
            className="agent-selector"
            title="Select AI Agent"
          >
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.model_name})
              </option>
            ))}
          </select>
        </div>

        {/* Settings Button */}
        <ThemeToggle />
        
        <button
          onClick={onSettingsClick}
          className="settings-button"
          title="Chat Settings"
        >
          <ChatIcons.Settings />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 
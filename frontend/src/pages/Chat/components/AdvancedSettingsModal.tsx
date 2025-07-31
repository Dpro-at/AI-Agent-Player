/**
 * AdvancedSettingsModal Component
 * Comprehensive settings modal with multiple tabs for chat configuration
 */

import React, { useState } from 'react';
import { ChatIcons } from './Icons';

interface Agent {
  id: number;
  name: string;
  model_provider: string;
  model_name: string;
}

interface AdvancedSettingsModalProps {
  onClose: () => void;
  agents: Agent[];
}

interface ChatSettings {
  // General
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  sounds: boolean;
  autoSave: boolean;
  showTimestamps: boolean;
  
  // Model
  defaultAgent: number | null;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
  stopSequences: string[];
  
  // Advanced
  streamResponses: boolean;
  saveHistory: boolean;
  enableAnalytics: boolean;
  autoTranslate: boolean;
  contentModeration: boolean;
  maxConversations: number;
  
  // Privacy
  shareData: boolean;
  anonymousUsage: boolean;
  encryptData: boolean;
  autoDeleteAfter: number;
}

const defaultSettings: ChatSettings = {
  theme: 'auto',
  language: 'en',
  notifications: true,
  sounds: true,
  autoSave: true,
  showTimestamps: true,
  defaultAgent: null,
  temperature: 0.7,
  maxTokens: 4000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemPrompt: '',
  stopSequences: [],
  streamResponses: true,
  saveHistory: true,
  enableAnalytics: false,
  autoTranslate: false,
  contentModeration: true,
  maxConversations: 50,
  shareData: false,
  anonymousUsage: true,
  encryptData: true,
  autoDeleteAfter: 30
};

export const AdvancedSettingsModal: React.FC<AdvancedSettingsModalProps> = ({ 
  onClose, 
  agents 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [watchPaths, setWatchPaths] = useState<Array<{
    id: string;
    path: string;
    enabled: boolean;
    type: 'file' | 'directory';
  }>>([]);

  const tabs = [
    { id: 'general', label: 'General', icon: <ChatIcons.Settings /> },
    { id: 'model', label: 'Model', icon: <ChatIcons.Bot /> },
    { id: 'agents', label: 'Agents', icon: <ChatIcons.Globe /> },
    { id: 'advanced', label: 'Advanced', icon: <ChatIcons.Upload /> },
    { id: 'knowledge', label: 'Knowledge', icon: <ChatIcons.Upload /> },
    { id: 'privacy', label: 'Privacy', icon: <ChatIcons.Settings /> }
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileUpload = async (files: FileList) => {
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`toggle-switch ${checked ? 'on' : 'off'}`}
    >
      <div className="toggle-slider" />
    </button>
  );

  const renderGeneralTab = () => (
    <div className="settings-section">
      <h3>Appearance</h3>
      <div className="setting-group">
        <label>Theme</label>
        <select
          value={settings.theme}
          onChange={(e) => handleSettingChange('general', 'theme', e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Language</label>
        <select
          value={settings.language}
          onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <h3>Behavior</h3>
      <div className="setting-row">
        <span>Enable Notifications</span>
        <ToggleSwitch
          checked={settings.notifications}
          onChange={() => handleSettingChange('general', 'notifications', !settings.notifications)}
        />
      </div>

      <div className="setting-row">
        <span>Sound Effects</span>
        <ToggleSwitch
          checked={settings.sounds}
          onChange={() => handleSettingChange('general', 'sounds', !settings.sounds)}
        />
      </div>

      <div className="setting-row">
        <span>Auto-save Conversations</span>
        <ToggleSwitch
          checked={settings.autoSave}
          onChange={() => handleSettingChange('general', 'autoSave', !settings.autoSave)}
        />
      </div>

      <div className="setting-row">
        <span>Show Timestamps</span>
        <ToggleSwitch
          checked={settings.showTimestamps}
          onChange={() => handleSettingChange('general', 'showTimestamps', !settings.showTimestamps)}
        />
      </div>
    </div>
  );

  const renderModelTab = () => (
    <div className="settings-section">
      <h3>Model Configuration</h3>
      <div className="setting-group">
        <label>Default Agent</label>
        <select
          value={settings.defaultAgent || ''}
          onChange={(e) => handleSettingChange('model', 'defaultAgent', parseInt(e.target.value) || null)}
        >
          <option value="">Select Agent</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>
              {agent.name} ({agent.model_name})
            </option>
          ))}
        </select>
      </div>

      <div className="setting-group">
        <label>Temperature: {settings.temperature}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.temperature}
          onChange={(e) => handleSettingChange('model', 'temperature', parseFloat(e.target.value))}
        />
        <small>Controls randomness (0 = deterministic, 2 = very random)</small>
      </div>

      <div className="setting-group">
        <label>Max Tokens: {settings.maxTokens}</label>
        <input
          type="range"
          min="100"
          max="8000"
          step="100"
          value={settings.maxTokens}
          onChange={(e) => handleSettingChange('model', 'maxTokens', parseInt(e.target.value))}
        />
      </div>

      <div className="setting-group">
        <label>System Prompt</label>
        <textarea
          value={settings.systemPrompt}
          onChange={(e) => handleSettingChange('model', 'systemPrompt', e.target.value)}
          placeholder="Enter system prompt to guide AI behavior..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-section">
      <h3>Data Privacy</h3>
      <div className="setting-row">
        <span>Share Usage Data</span>
        <ToggleSwitch
          checked={settings.shareData}
          onChange={() => handleSettingChange('privacy', 'shareData', !settings.shareData)}
        />
      </div>

      <div className="setting-row">
        <span>Anonymous Usage Statistics</span>
        <ToggleSwitch
          checked={settings.anonymousUsage}
          onChange={() => handleSettingChange('privacy', 'anonymousUsage', !settings.anonymousUsage)}
        />
      </div>

      <div className="setting-row">
        <span>Encrypt Local Data</span>
        <ToggleSwitch
          checked={settings.encryptData}
          onChange={() => handleSettingChange('privacy', 'encryptData', !settings.encryptData)}
        />
      </div>

      <div className="setting-group">
        <label>Auto-delete Conversations After (days)</label>
        <input
          type="number"
          min="1"
          max="365"
          value={settings.autoDeleteAfter}
          onChange={(e) => handleSettingChange('privacy', 'autoDeleteAfter', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab();
      case 'model': return renderModelTab();
      case 'privacy': return renderPrivacyTab();
      default: return <div>Tab content for {activeTab}</div>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="advanced-settings-modal">
        <div className="modal-header">
          <h2>Chat Settings</h2>
          <button onClick={onClose} className="close-button">
            <ChatIcons.X />
          </button>
        </div>

        <div className="modal-content">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={onClose} className="save-button">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsModal; 
import React, { useState } from 'react';
import type { SettingsSection } from '../types/newTypes';
import ThemeEditor from './ThemeEditor';
import SecuritySettingsComponent from './SecuritySettingsComponent';
import SettingsLogsComponent from './SettingsLogsComponent';
import ThemeSettingsComponent from './ThemeSettingsComponent';
import NotificationSettingsComponent from './NotificationSettingsComponent';
import AIModelsSettingsComponent from './AIModelsSettingsComponent';
import IntegrationsSettingsComponent from './IntegrationsSettingsComponent';
import AdvancedSettingsComponent from './AdvancedSettingsComponent';
import SettingsImportExportComponent from './SettingsImportExportComponent';
import AccountSecurityComponent from './AccountSecurityComponent';
import BillingPlansComponent from './BillingPlansComponent';
// Import new components
import ProfileSettings from './ProfileSettings';
import DeveloperModeSettings from './DeveloperModeSettings';
import {
  PrivacyControlsComponent,
  LayoutSettingsComponent,
  TypographyComponent,
  PromptTemplatesComponent,
  ModelTrainingComponent,
  APISettingsComponent,
  WebhooksComponent,
  DataImportComponent,
  EmailSettingsComponent,
  MobileAlertsComponent,
  BackupRestoreComponent
} from './AdditionalSettingsComponents';

// Marketplace Component
const ThemeMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const themes = [
    {
      id: 1,
      name: 'Dark Matrix',
      author: 'TechDesigner',
      description: 'Professional dark theme with green accents',
      downloads: 1234,
      rating: 4.8,
      price: 'Free',
      preview: '/theme-previews/dark-matrix.jpg',
      colors: { primary: '#00ff88', background: '#0d1117' }
    },
    {
      id: 2,
      name: 'Sunset Gradient',
      author: 'ColorMaster',
      description: 'Warm gradient theme perfect for creative work',
      downloads: 892,
      rating: 4.6,
      price: '$2.99',
      preview: '/theme-previews/sunset.jpg',
      colors: { primary: '#ff6b6b', background: '#ffe66d' }
    },
    {
      id: 3,
      name: 'Ocean Breeze',
      author: 'WaveDesign',
      description: 'Cool blue theme',
      downloads: 567,
      rating: 4.9,
      price: 'Free',
      preview: '/theme-previews/ocean.jpg',
      colors: { primary: '#4fc3f7', background: '#e3f2fd' }
    },
  ];

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || theme.price === selectedCategory)
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#2c3e50' }}>
          🏪 Theme Marketplace
        </h2>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Discover and install community themes or publish your own creations
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search themes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 16px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white',
          }}
        >
          <option value="all">All Themes</option>
          <option value="Free">Free Themes</option>
          <option value="$2.99">Premium Themes</option>
        </select>

        <button
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          🎨 Create Theme
        </button>
      </div>

      {/* Theme Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredThemes.map(theme => (
          <div
            key={theme.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {/* Preview */}
            <div
              style={{
                height: '120px',
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.background})`,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.9)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                color: theme.price === 'Free' ? '#27ae60' : '#e74c3c',
              }}>
                {theme.price}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                  {theme.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#f39c12', fontSize: '14px' }}>⭐</span>
                  <span style={{ fontSize: '14px', color: '#7f8c8d' }}>{theme.rating}</span>
                </div>
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#7f8c8d', lineHeight: '1.4' }}>
                {theme.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#95a5a6' }}>
                  by {theme.author}
                </span>
                <span style={{ fontSize: '12px', color: '#95a5a6' }}>
                  📥 {theme.downloads.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: theme.price === 'Free' ? '#27ae60' : '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {theme.price === 'Free' ? 'Install' : 'Buy Now'}
                </button>
                <button
                  style={{
                    padding: '8px 12px',
                    background: 'transparent',
                    color: '#7f8c8d',
                    border: '1px solid #e1e5e9',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div style={{
        marginTop: '40px',
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        borderRadius: '12px',
        padding: '24px',
        color: 'white',
        textAlign: 'center' as const,
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600' }}>
          🚀 Share Your Creativity
        </h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
          Create amazing themes and share them with the community. Earn from your designs!
        </p>
        <button
          style={{
            padding: '12px 32px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          📤 Submit Your Theme
        </button>
      </div>
    </div>
  );
};

// Complete Settings Sidebar - All Sections
const CompleteSettingsSidebar = () => {
  const settingsSections = [
    // Profile & Account
    { id: 'profile', title: 'Profile Settings', icon: '👤', category: 'Account', description: 'Personal information and account details' },
    { id: 'account', title: 'Account Security', icon: '🔐', category: 'Account', description: 'Security settings and password management' },
    { id: 'billing', title: 'Billing & Plans', icon: '💳', category: 'Account', description: 'Subscription management and billing' },
    { id: 'privacy', title: 'Privacy Controls', icon: '🔒', category: 'Account', description: 'Data privacy and user permissions' },
    
    // Appearance & Themes
    { id: 'themes', title: 'Theme Editor', icon: '🎨', category: 'Appearance', description: 'Create and customize themes' },
    { id: 'marketplace', title: 'Theme Marketplace', icon: '🏪', category: 'Appearance', description: 'Browse and download community themes' },
    { id: 'theme', title: 'Theme Settings', icon: '🌈', category: 'Appearance', description: 'Visual customization and colors' },
    { id: 'layout', title: 'Layout Settings', icon: '📐', category: 'Appearance', description: 'Interface layout and spacing' },
    { id: 'fonts', title: 'Typography', icon: '🔤', category: 'Appearance', description: 'Font settings and text styling' },
    
    // AI & Models
    { id: 'models', title: 'AI Models', icon: '🤖', category: 'AI', description: 'AI model configuration and API keys' },
    { id: 'prompts', title: 'Prompt Templates', icon: '📝', category: 'AI', description: 'Custom prompt templates and management' },
    { id: 'training', title: 'Model Training', icon: '🧠', category: 'AI', description: 'AI model training and fine-tuning' },
    { id: 'api', title: 'API Settings', icon: '🔗', category: 'AI', description: 'API configuration and rate limits' },
    
    // Integrations
    { id: 'integrations', title: 'Integrations', icon: '🔌', category: 'Integrations', description: 'Third-party service integrations' },
    { id: 'webhooks', title: 'Webhooks', icon: '🪝', category: 'Integrations', description: 'Webhook configuration and management' },
    { id: 'exports', title: 'Data Export', icon: '📤', category: 'Integrations', description: 'Export data and configurations' },
    { id: 'imports', title: 'Data Import', icon: '📥', category: 'Integrations', description: 'Import data and configurations' },
    
    // Notifications
    { id: 'notifications', title: 'Notifications', icon: '🔔', category: 'Notifications', description: 'General notification preferences' },
    { id: 'email', title: 'Email Settings', icon: '📧', category: 'Notifications', description: 'Email notification configuration' },
    { id: 'mobile', title: 'Mobile Alerts', icon: '📱', category: 'Notifications', description: 'Mobile push notification settings' },
    
    // Advanced
    { id: 'advanced', title: 'Advanced Settings', icon: '⚙️', category: 'Advanced', description: 'Developer and advanced configuration' },
    { id: 'developer', title: 'Developer Tools', icon: '👨‍💻', category: 'Advanced', description: 'Development tools and debugging' },
    { id: 'logs', title: 'Activity Logs', icon: '📊', category: 'Advanced', description: 'View system activity and logs' },
    { id: 'backup', title: 'Backup & Restore', icon: '💾', category: 'Advanced', description: 'System backup and restoration' },
  ];

  return settingsSections;
};

interface SettingsContentProps {
  section?: SettingsSection;
  onSave: () => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ section, onSave }) => {
  if (!section) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center' as const,
        color: '#7f8c8d',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Select a Setting</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>
          Choose from {CompleteSettingsSidebar().length} available settings categories
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        padding: '32px',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
      }}>
        <h2 style={{ fontSize: '24px', margin: '0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>{section.icon}</span>
          {section.title}
        </h2>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>{section.description}</p>
      </div>

      {/* Content */}
      <div style={{ padding: '32px' }}>
        {/* Settings Controls */}
        <div style={{ marginTop: '0px' }}>
          {section.id === 'profile' && <ProfileSettings />}
          
          {section.id === 'developer-mode' && <DeveloperModeSettings />}

          {section.id === 'themes' && <ThemeEditor />}
          
          {section.id === 'marketplace' && <ThemeMarketplace />}

          {section.id === 'theme' && <ThemeSettingsComponent />}

          {section.id === 'security' && <SecuritySettingsComponent />}

          {section.id === 'notifications' && <NotificationSettingsComponent />}

          {section.id === 'models' && <AIModelsSettingsComponent />}

          {section.id === 'integrations' && <IntegrationsSettingsComponent />}

          {section.id === 'advanced' && <AdvancedSettingsComponent />}

          {section.id === 'logs' && <SettingsLogsComponent />}

          {section.id === 'exports' && <SettingsImportExportComponent />}

          {section.id === 'account' && <AccountSecurityComponent />}
          {section.id === 'billing' && <BillingPlansComponent />}
          {section.id === 'privacy' && <PrivacyControlsComponent />}
          {section.id === 'layout' && <LayoutSettingsComponent />}
          {section.id === 'fonts' && <TypographyComponent />}
          {section.id === 'prompts' && <PromptTemplatesComponent />}
          {section.id === 'training' && <ModelTrainingComponent />}
          {section.id === 'api' && <APISettingsComponent />}
          {section.id === 'webhooks' && <WebhooksComponent />}
          {section.id === 'imports' && <DataImportComponent />}
          {section.id === 'email' && <EmailSettingsComponent />}
          {section.id === 'mobile' && <MobileAlertsComponent />}
          {section.id === 'backup' && <BackupRestoreComponent />}

          {/* Default content for non-implemented sections */}
          {![
            'profile', 'themes', 'marketplace', 'theme', 'notifications', 'models', 
            'integrations', 'exports', 'advanced', 'logs', 'account', 'billing', 
            'privacy', 'layout', 'fonts', 'prompts', 'training', 'api', 'webhooks', 
            'imports', 'email', 'mobile', 'developer-mode', 'backup'
          ].includes(section.id) && (
            <div style={{
              padding: '24px',
              background: 'rgba(241, 196, 15, 0.1)',
              borderRadius: '12px',
              textAlign: 'center' as const,
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚧</div>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>Settings Under Development</div>
              <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                This section will be available in the next update!
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '32px', textAlign: 'right' as const }}>
          <button
            onClick={onSave}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent; 
import React from 'react';
import { useSettings } from './hooks/useSettings';
import {
  GeneralTab,
  ProfileTab,
  LLMTab,
  KnowledgeTab,
  UpdatesTab,
  AISyncTab,
  SimpleSystemHealth,
} from './components';
import { TAB_LIST } from './utils/constants';

const SettingsPage: React.FC = () => {
  const {
    // State
    theme,
    setTheme,
    activeTab,
    setActiveTab,
    generalSubTab,
    setGeneralSubTab,
    user,
    profile,
    loading,
    error,
    showDeleteInfo,
    settingsJson,
    setSettingsJson,
    
    // Actions
    navigate,
    handleDeleteRequest,
    handleShareErrorsChange,
    handleFileUpload,
    updateUserSettings,
  } = useSettings();

  // Render appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralTab
            settingsJson={settingsJson}
            setSettingsJson={setSettingsJson}
            generalSubTab={generalSubTab}
            setGeneralSubTab={setGeneralSubTab}
            handleFileUpload={handleFileUpload}
            user={user}
            updateUserSettings={updateUserSettings}
          />
        );

      case 'profile':
        return (
          <ProfileTab
            user={user}
            profile={profile}
            showDeleteInfo={showDeleteInfo}
            handleDeleteRequest={handleDeleteRequest}
            handleShareErrorsChange={handleShareErrorsChange}
          />
        );

      case 'llm':
        return (
          <LLMTab
            settingsJson={settingsJson}
            setSettingsJson={setSettingsJson}
          />
        );

      case 'knowledge':
        return <KnowledgeTab />;

      case 'updates':
        return <UpdatesTab navigate={navigate} />;

      case 'aisync':
        return (
          <AISyncTab
            settingsJson={settingsJson}
            setSettingsJson={setSettingsJson}
            handleFileUpload={handleFileUpload}
          />
        );

      case 'system-health':
        return <SimpleSystemHealth />;

      default:
        return (
          <div style={{ padding: '24px 0' }}>
            <h3>Settings</h3>
            <div style={{ color: '#888' }}>Select a tab to configure settings.</div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: '#ffebee',
        color: '#c62828',
        borderRadius: '4px'
      }}>
        <h3>Error</h3>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        borderRight: '1px solid #e0e0e0',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ padding: '24px 16px' }}>
          <h2 style={{
            margin: '0 0 24px 0',
            fontSize: '20px',
            fontWeight: 600,
            color: '#1a1a1a'
          }}>
            Settings
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Search settings..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            {TAB_LIST.map((tab) => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  marginBottom: '4px',
                  backgroundColor: activeTab === tab.key ? '#e3f2fd' : 'transparent',
                  color: activeTab === tab.key ? '#1976d2' : '#666',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        backgroundColor: '#fff',
        overflow: 'auto'
      }}>
        <div style={{
          padding: '32px',
          maxWidth: '800px'
        }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FloatingDevToolProps {
  isDeveloperMode: boolean;
}

const FloatingDevTool: React.FC<FloatingDevToolProps> = ({ isDeveloperMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [systemStats, setSystemStats] = useState({
    memory: '0 MB',
    activeConnections: 0,
    errorCount: 0,
    lastError: null as string | null
  });
  const navigate = useNavigate();

  // إخفاء الأداة إذا لم يكن Developer Mode مفعل
  if (!isDeveloperMode) {
    return null;
  }

  // وظائف الأدوات السريعة
  const quickActions = {
    clearCache: () => {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      window.location.reload();
    },

    goToDevTools: () => {
      navigate('/settings?section=developer');
      setIsOpen(false);
    },

    reloadPage: () => {
      window.location.reload();
    },

    copyPageInfo: () => {
      const pageInfo = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        localStorage: Object.keys(localStorage).length,
        sessionStorage: Object.keys(sessionStorage).length,
        errors: systemStats.errorCount
      };
      navigator.clipboard.writeText(JSON.stringify(pageInfo, null, 2));
      alert('📋 Page info copied to clipboard!');
    },

    toggleConsole: () => {
      // سيتم ربطه بمكون Console Logger
      console.log('🔧 Developer Console Toggled');
    },

    showNetworkInfo: () => {
      const networkInfo = {
        online: navigator.onLine,
        connection: (navigator as any).connection?.effectiveType || 'unknown',
        cookiesEnabled: navigator.cookieEnabled,
        language: navigator.language
      };
      alert(`🌐 Network Info:\n${JSON.stringify(networkInfo, null, 2)}`);
    }
  };

  return (
    <>
      {/* الأيقونة العائمة */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px'
        }}
      >
        {/* قائمة الأدوات */}
        {isOpen && (
          <div
            style={{
              background: 'rgba(44, 62, 80, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              minWidth: '280px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div style={{ color: 'white', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                🛠️ Developer Tools
              </div>
              <div style={{ fontSize: '11px', color: '#bdc3c7' }}>
                Quick development actions
              </div>
            </div>

            {/* الأدوات السريعة */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* إجراءات سريعة */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={quickActions.clearCache}
                  style={{
                    padding: '8px 12px',
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🗑️ Clear Cache
                </button>

                <button
                  onClick={quickActions.reloadPage}
                  style={{
                    padding: '8px 12px',
                    background: 'linear-gradient(135deg, #3498db, #2980b9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🔄 Reload
                </button>

                <button
                  onClick={quickActions.copyPageInfo}
                  style={{
                    padding: '8px 12px',
                    background: 'linear-gradient(135deg, #f39c12, #d68910)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  📋 Copy Info
                </button>

                <button
                  onClick={quickActions.showNetworkInfo}
                  style={{
                    padding: '8px 12px',
                    background: 'linear-gradient(135deg, #27ae60, #229954)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🌐 Network
                </button>
              </div>

              {/* فاصل */}
              <div style={{ height: '1px', background: '#34495e', margin: '8px 0' }}></div>

              {/* إحصائيات سريعة */}
              <div style={{ fontSize: '10px', color: '#bdc3c7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Memory:</span>
                  <span style={{ color: '#f39c12' }}>{systemStats.memory}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Errors:</span>
                  <span style={{ color: systemStats.errorCount > 0 ? '#e74c3c' : '#27ae60' }}>
                    {systemStats.errorCount}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Active:</span>
                  <span style={{ color: '#3498db' }}>{systemStats.activeConnections} connections</span>
                </div>
              </div>

              {/* فاصل */}
              <div style={{ height: '1px', background: '#34495e', margin: '8px 0' }}></div>

              {/* الانتقال لأدوات التطوير */}
              <button
                onClick={quickActions.goToDevTools}
                style={{
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                🔧 Open Dev Console
              </button>
            </div>
          </div>
        )}

        {/* زر الأيقونة الرئيسية */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isOpen 
              ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
              : 'linear-gradient(135deg, #3498db, #2980b9)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
          }}
          title="Developer Tools"
        >
          {isOpen ? '×' : '🔧'}
        </button>
      </div>

      {/* CSS للأنيميشن */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default FloatingDevTool; 
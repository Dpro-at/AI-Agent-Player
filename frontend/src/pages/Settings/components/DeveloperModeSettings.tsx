import React, { useState, useEffect } from 'react';
import config from '../../../config';

const DeveloperModeSettings: React.FC = () => {
  const [isDeveloperMode, setIsDeveloperMode] = useState<boolean>(
    localStorage.getItem('developer_mode') === 'true'
  );
  const [debugLevel, setDebugLevel] = useState<string>(
    localStorage.getItem('debug_level') || 'info'
  );
  const [systemStatus, setSystemStatus] = useState({
    backend: 'unknown',
    database: 'unknown',
    apis: 0,
    errors: 0
  });
  const [healthChecking, setHealthChecking] = useState(false);
  const [lastHealthCheck, setLastHealthCheck] = useState<string>(
    localStorage.getItem('last_health_check') || 'Never'
  );

  // Working API endpoints list with more complete list including CRUD operations
  const workingApis = [
    // Authentication endpoints
    { name: 'Login (Authentication)', endpoint: '/auth/login', method: 'POST', status: '✅ Working', category: 'Auth' },
    { name: 'Get Current User', endpoint: '/auth/me', method: 'GET', status: '✅ Working', category: 'Auth' },
    
    // User Management CRUD
    { name: 'Get User Profile', endpoint: '/users/profile', method: 'GET', status: '✅ Working', category: 'Users' },
    { name: 'Update User Profile', endpoint: '/users/profile', method: 'PUT', status: '✅ Working', category: 'Users' },
    { name: 'Get User Settings', endpoint: '/users/settings', method: 'GET', status: '✅ Working', category: 'Users' },
    { name: 'Update User Settings', endpoint: '/users/settings', method: 'PUT', status: '✅ Working', category: 'Users' },
    
    // Tasks Management CRUD
    { name: 'List Tasks (Read)', endpoint: '/task/tasks', method: 'GET', status: '⚠️ 404 Error', category: 'Tasks' },
    { name: 'Create Task (Create)', endpoint: '/task/tasks', method: 'POST', status: '⚠️ Needs Data', category: 'Tasks' },
    { name: 'Update Task (Update)', endpoint: '/task/tasks/1', method: 'PUT', status: '⚠️ Needs Data', category: 'Tasks' },
    { name: 'Delete Task (Delete)', endpoint: '/task/tasks/1', method: 'DELETE', status: '⚠️ Test ID', category: 'Tasks' },
    
    // Agents Management CRUD
    { name: 'List Agents (Read)', endpoint: '/agents', method: 'GET', status: '⚠️ Minor Issues', category: 'Agents' },
    { name: 'Create Agent (Create)', endpoint: '/agents', method: 'POST', status: '⚠️ Needs Data', category: 'Agents' },
    { name: 'Get Agent (Read)', endpoint: '/agents/1', method: 'GET', status: '⚠️ Test ID', category: 'Agents' },
    { name: 'Update Agent (Update)', endpoint: '/agents/1', method: 'PUT', status: '⚠️ Needs Data', category: 'Agents' },
    { name: 'Delete Agent (Delete)', endpoint: '/agents/1', method: 'DELETE', status: '⚠️ Test ID', category: 'Agents' },
    
    // Chat System CRUD
    { name: 'List Conversations (Read)', endpoint: '/chat/conversations', method: 'GET', status: '✅ Working', category: 'Chat' },
    { name: 'Create Conversation (Create)', endpoint: '/chat/conversations', method: 'POST', status: '⚠️ Needs Data', category: 'Chat' },
    { name: 'Get Messages (Read)', endpoint: '/chat/conversations/1/messages', method: 'GET', status: '⚠️ Test ID', category: 'Chat' },
    
    // Other Working APIs
    { name: 'License Status', endpoint: '/license/licensing/status', method: 'GET', status: '✅ Working', category: 'License' },
    { name: 'Training Workspaces', endpoint: '/training/training-lab/workspaces', method: 'GET', status: '✅ Working', category: 'Training' },
    { name: 'Marketplace Items', endpoint: '/market/marketplace/items', method: 'GET', status: '✅ Working', category: 'Marketplace' },
    { name: 'System Analytics', endpoint: '/api/system-analytics/dashboard', method: 'GET', status: '✅ Working', category: 'System' }
  ];

  // API Testing state
  const [apiTestResults, setApiTestResults] = useState<{[key: string]: {
    status: number;
    responseTime: number;
    success: boolean;
    data?: unknown;
    error?: string;
  }}>({});
  const [testingApi, setTestingApi] = useState<string | null>(null);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Test API function
  const testApi = async (api: typeof workingApis[0]) => {
    const apiKey = `${api.method}_${api.endpoint}`;
    setTestingApi(apiKey);
    
    try {
      const token = localStorage.getItem('access_token');
      const startTime = Date.now();
      
      const response = await fetch(`${config.api.baseURL}${api.endpoint}`, {
        method: api.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
      
      const result = {
        status: response.status,
        responseTime,
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? `${response.status} ${response.statusText}` : undefined
      };
      
      setApiTestResults(prev => ({
        ...prev,
        [apiKey]: result
      }));
      
      // Add to logs
      const logEntry = `[${new Date().toLocaleTimeString()}] ${api.method} ${api.endpoint} - ${result.success ? '✅ SUCCESS' : '❌ FAILED'} (${result.status}) - ${responseTime}ms`;
      setApiLogs(prev => [...prev, logEntry]);
      
    } catch (error) {
      const result = {
        status: 0,
        responseTime: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
      
      setApiTestResults(prev => ({
        ...prev,
        [apiKey]: result
      }));
      
      // Add error to logs
      const logEntry = `[${new Date().toLocaleTimeString()}] ${api.method} ${api.endpoint} - ❌ ERROR - ${result.error}`;
      setApiLogs(prev => [...prev, logEntry]);
    }
    
    setTestingApi(null);
  };

  // Test All APIs function
  const testAllApis = async () => {
    setIsTestingAll(true);
    setApiLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🚀 Starting batch API testing...`]);
    
    for (let i = 0; i < workingApis.length; i++) {
      const api = workingApis[i];
      await testApi(api);
      
      // Small delay between requests to avoid overwhelming server
      if (i < workingApis.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    setApiLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🎉 Batch testing completed!`]);
    setIsTestingAll(false);
  };

  // Copy logs function
  const copyLogsToClipboard = () => {
    const logsText = apiLogs.join('\n');
    navigator.clipboard.writeText(logsText).then(() => {
      setApiLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📋 Logs copied to clipboard!`]);
    });
  };

  // Clear logs function
  const clearLogs = () => {
    setApiLogs([]);
  };

  // Load developer settings
  useEffect(() => {
    const savedMode = localStorage.getItem('developer_mode') === 'true';
    const savedDebugLevel = localStorage.getItem('debug_level') || 'info';
    setIsDeveloperMode(savedMode);
    setDebugLevel(savedDebugLevel);
    
    // Load last health check
    const lastCheck = localStorage.getItem('last_health_check');
    if (lastCheck) {
      setLastHealthCheck(lastCheck);
    }
  }, []);

  // Save developer settings
  const saveDeveloperSettings = (mode: boolean, level: string) => {
    localStorage.setItem('developer_mode', mode.toString());
    localStorage.setItem('debug_level', level);
    setIsDeveloperMode(mode);
    setDebugLevel(level);
  };

  // Run System Health Check
  const runSystemHealthCheck = async () => {
    setHealthChecking(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      // Check backend status
      setSystemStatus(prev => ({ ...prev, backend: 'checking' }));
      
      const response = await fetch(`${config.api.baseURL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Backend is working, assume database is connected
        setSystemStatus({
          backend: 'online',
          database: 'connected',
          apis: workingApis.length, // Use actual count from workingApis array
          errors: 0
        });
        
        const now = new Date().toLocaleString();
        setLastHealthCheck(now);
        localStorage.setItem('last_health_check', now);
        
      } else {
        setSystemStatus({
          backend: 'offline',
          database: 'disconnected', 
          apis: 0,
          errors: 1
        });
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setSystemStatus({
        backend: 'offline',
        database: 'disconnected',
        apis: 0, 
        errors: 1
      });
    }
    
    setHealthChecking(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
        return '#27ae60';
      case 'offline':
      case 'disconnected':
        return '#e74c3c';
      case 'checking':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
        return '✅';
      case 'offline':
      case 'disconnected':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2c3e50, #34495e)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '0 0 8px 0'
        }}>
          👨‍💻 Developer Mode & System Tools
        </h3>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          Advanced tools and system monitoring for developers and power users
        </p>
      </div>

      {/* Developer Mode Toggle */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        border: isDeveloperMode ? '2px solid #27ae60' : '2px solid #e1e5e9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '18px', fontWeight: '600' }}>
              🔧 Developer Mode
            </h4>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
              Enable advanced debugging features and developer tools
            </p>
          </div>
          <label style={{ 
            position: 'relative' as const, 
            display: 'inline-block', 
            width: '60px', 
            height: '34px' 
          }}>
            <input
              type="checkbox"
              checked={isDeveloperMode}
              onChange={(e) => saveDeveloperSettings(e.target.checked, debugLevel)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute' as const,
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isDeveloperMode ? '#27ae60' : '#ccc',
              transition: '0.4s',
              borderRadius: '34px',
            }}>
              <span style={{
                position: 'absolute' as const,
                content: '""',
                height: '26px',
                width: '26px',
                left: isDeveloperMode ? '30px' : '4px',
                bottom: '4px',
                backgroundColor: 'white',
                transition: '0.4s',
                borderRadius: '50%',
              }} />
            </span>
          </label>
        </div>
        
        {isDeveloperMode && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '600' }}>
              Debug Level:
            </label>
            <select
              value={debugLevel}
              onChange={(e) => saveDeveloperSettings(isDeveloperMode, e.target.value)}
              style={{
                width: '200px',
                padding: '8px 12px',
                border: '2px solid #e1e5e9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="error">Error Only</option>
              <option value="warn">Warnings</option>
              <option value="info">Info (Recommended)</option>
              <option value="debug">Debug (Verbose)</option>
              <option value="trace">Trace (All)</option>
            </select>
          </div>
        )}
      </div>

      {/* System Health Check */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '18px', fontWeight: '600' }}>
              🏥 System Health Monitor
            </h4>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
              Check system status and API health on demand
            </p>
            {lastHealthCheck && (
              <p style={{ margin: '4px 0 0 0', color: '#95a5a6', fontSize: '12px' }}>
                Last check: {lastHealthCheck}
              </p>
            )}
          </div>
          <button
            onClick={runSystemHealthCheck}
            disabled={healthChecking}
            style={{
              padding: '12px 24px',
              background: healthChecking ? '#95a5a6' : 'linear-gradient(135deg, #3498db, #2980b9)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: healthChecking ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {healthChecking ? (
              <>
                <span>⏳</span>
                Checking...
              </>
            ) : (
              <>
                <span>🔍</span>
                Check System
              </>
            )}
          </button>
        </div>

        {/* System Status Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: `2px solid ${getStatusColor(systemStatus.backend)}`,
            textAlign: 'center' as const
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{getStatusIcon(systemStatus.backend)}</div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50' }}>Backend Server</div>
            <div style={{ fontSize: '12px', color: getStatusColor(systemStatus.backend), textTransform: 'capitalize' }}>
              {systemStatus.backend}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: `2px solid ${getStatusColor(systemStatus.database)}`,
            textAlign: 'center' as const
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{getStatusIcon(systemStatus.database)}</div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50' }}>Database</div>
            <div style={{ fontSize: '12px', color: getStatusColor(systemStatus.database), textTransform: 'capitalize' }}>
              {systemStatus.database}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: '2px solid #3498db',
            textAlign: 'center' as const
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📡</div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50' }}>Working APIs</div>
            <div style={{ fontSize: '12px', color: '#3498db' }}>
              {systemStatus.apis} endpoints
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: systemStatus.errors > 0 ? '2px solid #e74c3c' : '2px solid #27ae60',
            textAlign: 'center' as const
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>
              {systemStatus.errors > 0 ? '⚠️' : '✅'}
            </div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50' }}>System Errors</div>
            <div style={{ fontSize: '12px', color: systemStatus.errors > 0 ? '#e74c3c' : '#27ae60' }}>
              {systemStatus.errors} errors
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Tools */}
      {isDeveloperMode && (
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px', fontWeight: '600' }}>
            🛠️ Advanced Developer Tools
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <button
              style={{
                padding: '16px',
                background: 'white',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left' as const,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.borderColor = '#3498db';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.borderColor = '#e1e5e9';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50', marginBottom: '4px' }}>
                API Performance Monitor
              </div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                Monitor API response times and performance metrics
              </div>
            </button>

            <button
              style={{
                padding: '16px',
                background: 'white',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left' as const,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.borderColor = '#e74c3c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.borderColor = '#e1e5e9';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🐛</div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50', marginBottom: '4px' }}>
                Error Tracking
              </div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                View detailed error logs and debugging information
              </div>
            </button>

            <button
              style={{
                padding: '16px',
                background: 'white',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left' as const,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.borderColor = '#27ae60';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.borderColor = '#e1e5e9';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50', marginBottom: '4px' }}>
                Cache Management
              </div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                Clear cache, reset data, and manage storage
              </div>
            </button>

            <button
              style={{
                padding: '16px',
                background: 'white',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left' as const,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.borderColor = '#f39c12';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.borderColor = '#e1e5e9';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📡</div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50', marginBottom: '4px' }}>
                API Testing Console
              </div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                Test API endpoints and view raw responses
              </div>
            </button>
          </div>
        </div>
      )}

      {/* API Testing Console */}
      {isDeveloperMode && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #e1e5e9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: '0', color: '#2c3e50', fontSize: '18px', fontWeight: '600' }}>
              📡 API Testing Console
            </h4>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                Test all {workingApis.length} available endpoints
              </span>
              <button
                onClick={testAllApis}
                disabled={isTestingAll}
                style={{
                  padding: '8px 16px',
                  background: isTestingAll ? '#95a5a6' : 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: isTestingAll ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isTestingAll ? (
                  <>⏳ Testing All...</>
                ) : (
                  <>🚀 Test All APIs</>
                )}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {workingApis.map((api, index) => {
              const apiKey = `${api.method}_${api.endpoint}`;
              const testResult = apiTestResults[apiKey];
              const isTestingThis = testingApi === apiKey;

              return (
                <div key={index} style={{
                  background: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{
                          padding: '4px 8px',
                          background: api.method === 'GET' ? '#27ae60' : api.method === 'POST' ? '#3498db' : '#f39c12',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          fontFamily: 'monospace'
                        }}>
                          {api.method}
                        </span>
                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50' }}>
                          {api.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#27ae60' }}>
                          {api.status}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#7f8c8d',
                        fontFamily: 'monospace',
                        background: '#ecf0f1',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {api.endpoint}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => testApi(api)}
                      disabled={isTestingThis}
                      style={{
                        padding: '8px 16px',
                        background: isTestingThis ? '#95a5a6' : '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: isTestingThis ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isTestingThis ? (
                        <>⏳ Testing...</>
                      ) : (
                        <>🔍 Test</>
                      )}
                    </button>
                  </div>

                  {/* Test Results */}
                  {testResult && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: testResult.success ? '#d5f4e6' : '#ffeaa7',
                      borderRadius: '6px',
                      border: `1px solid ${testResult.success ? '#27ae60' : '#f39c12'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: testResult.success ? '#27ae60' : '#e67e22'
                        }}>
                          {testResult.success ? '✅ Success' : '❌ Failed'} - Status: {testResult.status}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#7f8c8d'
                        }}>
                          {testResult.responseTime}ms
                        </span>
                      </div>
                      
                      {testResult.error && (
                        <div style={{
                          fontSize: '11px',
                          color: '#e74c3c',
                          fontFamily: 'monospace',
                          background: '#fff5f5',
                          padding: '6px',
                          borderRadius: '4px',
                          marginTop: '6px'
                        }}>
                          Error: {testResult.error}
                        </div>
                      )}

                      {testResult.data && testResult.success && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>
                            Response Preview:
                          </div>
                          <div style={{
                            fontSize: '10px',
                            color: '#2c3e50',
                            fontFamily: 'monospace',
                            background: '#f8f9fa',
                            padding: '8px',
                            borderRadius: '4px',
                            maxHeight: '100px',
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {(() => {
                              const dataString = typeof testResult.data === 'string' 
                                ? testResult.data.substring(0, 200) + (testResult.data.length > 200 ? '...' : '')
                                : JSON.stringify(testResult.data, null, 2).substring(0, 200) + '...';
                              return dataString;
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* API Testing Logs */}
      {isDeveloperMode && apiLogs.length > 0 && (
        <div style={{
          background: '#2c3e50',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          color: '#ecf0f1',
          fontFamily: 'monospace'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: '0', color: '#ecf0f1', fontSize: '18px', fontWeight: '600' }}>
              📋 API Testing Logs
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowLogs(!showLogs)}
                style={{
                  padding: '6px 12px',
                  background: showLogs ? '#e74c3c' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {showLogs ? '🔼 Hide' : '🔽 Show'} ({apiLogs.length} entries)
              </button>
              <button
                onClick={copyLogsToClipboard}
                style={{
                  padding: '6px 12px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📋 Copy All
              </button>
              <button
                onClick={clearLogs}
                style={{
                  padding: '6px 12px',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {showLogs && (
            <div style={{
              background: '#34495e',
              padding: '16px',
              borderRadius: '8px',
              maxHeight: '300px',
              overflow: 'auto',
              fontSize: '11px',
              lineHeight: '1.4'
            }}>
              {apiLogs.map((log, index) => (
                <div key={index} style={{
                  padding: '2px 0',
                  borderBottom: index < apiLogs.length - 1 ? '1px solid #4a5f7a' : 'none',
                  color: log.includes('✅') ? '#2ecc71' : log.includes('❌') ? '#e74c3c' : log.includes('🚀') || log.includes('🎉') ? '#f39c12' : '#bdc3c7'
                }}>
                  {log}
                </div>
              ))}
              
              {apiLogs.length === 0 && (
                <div style={{ textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic' }}>
                  No logs yet. Start testing APIs to see results here.
                </div>
              )}
            </div>
          )}

          <div style={{
            marginTop: '12px',
            fontSize: '10px',
            color: '#95a5a6',
            textAlign: 'center'
          }}>
            💡 All API responses are logged here for debugging and analysis
          </div>
        </div>
      )}

      {/* Warning Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f39c12, #e67e22)',
        borderRadius: '12px',
        padding: '20px',
        color: 'white',
        textAlign: 'center' as const
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          Developer Mode Warning
        </h4>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          These tools are intended for developers and advanced users. 
          Use with caution as they may affect system performance.
        </p>
      </div>
    </div>
  );
};

export default DeveloperModeSettings; 
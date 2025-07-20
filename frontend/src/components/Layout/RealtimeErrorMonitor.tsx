import React, { useState, useEffect } from 'react';
import config from '../../config';

interface ApiCall {
  id: string;
  method: string;
  url: string;
  status: number;
  responseTime: number;
  timestamp: string;
  success: boolean;
  error?: string;
  data?: any;
}

interface RealtimeErrorMonitorProps {
  isDeveloperMode: boolean;
}

const RealtimeErrorMonitor: React.FC<RealtimeErrorMonitorProps> = ({ isDeveloperMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    speed: 'unknown',
    latency: 0
  });

  // إخفاء المراقب إذا لم يكن Developer Mode مفعل
  if (!isDeveloperMode) {
    return null;
  }

  // مراقبة حالة الشبكة
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(prev => ({ ...prev, online: true }));
    const handleOffline = () => setNetworkStatus(prev => ({ ...prev, online: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // اعتراض fetch requests لمراقبة API calls
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options = {}] = args;
      const startTime = Date.now();
      const method = options.method || 'GET';
      
      try {
        const response = await originalFetch(...args);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // إضافة API call للقائمة
        const apiCall: ApiCall = {
          id: Date.now().toString(),
          method,
          url: url.toString(),
          status: response.status,
          responseTime,
          timestamp: new Date().toLocaleTimeString(),
          success: response.ok
        };

        if (!response.ok) {
          apiCall.error = `${response.status} ${response.statusText}`;
          setErrors(prev => [...prev.slice(-9), `[${apiCall.timestamp}] ${method} ${url} - ${apiCall.error}`]);
        }

        setApiCalls(prev => [...prev.slice(-19), apiCall]);
        
        return response;
      } catch (error) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        const apiCall: ApiCall = {
          id: Date.now().toString(),
          method,
          url: url.toString(),
          status: 0,
          responseTime,
          timestamp: new Date().toLocaleTimeString(),
          success: false,
          error: error instanceof Error ? error.message : 'Network error'
        };

        setApiCalls(prev => [...prev.slice(-19), apiCall]);
        setErrors(prev => [...prev.slice(-9), `[${apiCall.timestamp}] ${method} ${url} - ${apiCall.error}`]);
        
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // مراقبة console errors
  useEffect(() => {
    const originalError = console.error;
    
    console.error = (...args) => {
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setErrors(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] Console Error: ${errorMessage}`]);
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // حساب الإحصائيات
  const stats = {
    totalCalls: apiCalls.length,
    successRate: apiCalls.length > 0 
      ? Math.round((apiCalls.filter(call => call.success).length / apiCalls.length) * 100)
      : 0,
    avgResponseTime: apiCalls.length > 0
      ? Math.round(apiCalls.reduce((sum, call) => sum + call.responseTime, 0) / apiCalls.length)
      : 0,
    errorCount: errors.length
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        background: isCollapsed 
          ? 'linear-gradient(135deg, #2c3e50, #34495e)'
          : 'rgba(44, 62, 80, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '2px solid #3498db',
        transition: 'all 0.3s ease'
      }}
    >
      {/* شريط العنوان */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: '600' }}>
            🐛 Dev Monitor
          </span>
          
          {/* إحصائيات سريعة */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ color: '#3498db' }}>
              📊 {stats.totalCalls} calls
            </span>
            <span style={{ color: stats.successRate >= 80 ? '#27ae60' : '#e74c3c' }}>
              ✅ {stats.successRate}%
            </span>
            <span style={{ color: '#f39c12' }}>
              ⚡ {stats.avgResponseTime}ms
            </span>
            <span style={{ color: stats.errorCount > 0 ? '#e74c3c' : '#27ae60' }}>
              🚨 {stats.errorCount} errors
            </span>
            <span style={{ color: networkStatus.online ? '#27ae60' : '#e74c3c' }}>
              🌐 {networkStatus.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '16px' }}>
          {isCollapsed ? '▲' : '▼'}
        </div>
      </div>

      {/* المحتوى المفصل */}
      {!isCollapsed && (
        <div style={{ padding: '16px', maxHeight: '300px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* آخر API Calls */}
            <div>
              <h4 style={{ color: '#3498db', margin: '0 0 12px 0', fontSize: '14px' }}>
                📡 Recent API Calls
              </h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {apiCalls.slice(-10).reverse().map(call => (
                  <div
                    key={call.id}
                    style={{
                      background: call.success ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                      border: `1px solid ${call.success ? '#27ae60' : '#e74c3c'}`,
                      borderRadius: '6px',
                      padding: '8px',
                      marginBottom: '6px',
                      fontSize: '11px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        color: call.method === 'GET' ? '#3498db' : call.method === 'POST' ? '#27ae60' : '#f39c12',
                        fontWeight: '600'
                      }}>
                        {call.method}
                      </span>
                      <span style={{ color: call.success ? '#27ae60' : '#e74c3c' }}>
                        {call.status} ({call.responseTime}ms)
                      </span>
                    </div>
                    <div style={{ color: '#bdc3c7', marginTop: '4px' }}>
                      {call.url.replace(config.api.baseURL, '')} • {call.timestamp}
                    </div>
                    {call.error && (
                      <div style={{ color: '#e74c3c', marginTop: '4px', fontSize: '10px' }}>
                        Error: {call.error}
                      </div>
                    )}
                  </div>
                ))}
                {apiCalls.length === 0 && (
                  <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
                    No API calls recorded yet
                  </div>
                )}
              </div>
            </div>

            {/* الأخطاء الأخيرة */}
            <div>
              <h4 style={{ color: '#e74c3c', margin: '0 0 12px 0', fontSize: '14px' }}>
                🚨 Recent Errors
              </h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {errors.slice(-10).reverse().map((error, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(231, 76, 60, 0.1)',
                      border: '1px solid #e74c3c',
                      borderRadius: '6px',
                      padding: '8px',
                      marginBottom: '6px',
                      fontSize: '10px',
                      color: '#ecf0f1',
                      fontFamily: 'monospace'
                    }}
                  >
                    {error}
                  </div>
                ))}
                {errors.length === 0 && (
                  <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
                    🎉 No errors - System running smoothly!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '16px',
            borderTop: '1px solid #34495e',
            paddingTop: '12px'
          }}>
            <button
              onClick={() => setApiCalls([])}
              style={{
                padding: '6px 12px',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear Calls
            </button>
            <button
              onClick={() => setErrors([])}
              style={{
                padding: '6px 12px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear Errors
            </button>
            <button
              onClick={() => {
                const data = { apiCalls, errors, stats };
                navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                alert('📋 Debug data copied to clipboard!');
              }}
              style={{
                padding: '6px 12px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              📋 Copy Debug Data
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '6px 12px',
                background: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              🔄 Reload Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeErrorMonitor; 
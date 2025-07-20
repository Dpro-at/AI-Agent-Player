import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { 
  Bug, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Search, 
  Download, 
  RefreshCw,
  Clock,
  Code,
  Terminal,
  Filter,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  userAgent?: string;
  userId?: string;
  component?: string;
  action?: string;
  details?: any;
}

interface ErrorStats {
  totalErrors: number;
  errorsToday: number;
  warningsToday: number;
  lastError: string;
  topError: string;
  errorRate: number;
}

export const ErrorTracking: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<ErrorLog[]>([]);
  const [errorStats, setErrorStats] = useState<ErrorStats>({
    totalErrors: 0,
    errorsToday: 0,
    warningsToday: 0,
    lastError: 'None',
    topError: 'None',
    errorRate: 0
  });
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [monitoring, setMonitoring] = useState<boolean>(false);

  useEffect(() => {
    loadErrorLogs();
    setupErrorCapture();
    return () => {
      // Cleanup error capture
      window.removeEventListener('error', captureError);
      window.removeEventListener('unhandledrejection', capturePromiseRejection);
    };
  }, []);

  useEffect(() => {
    filterErrors();
  }, [errors, filterLevel, searchTerm]);

  const loadErrorLogs = () => {
    // Load existing error logs from localStorage
    const storedErrors = localStorage.getItem('errorLogs');
    const errorList: ErrorLog[] = storedErrors ? JSON.parse(storedErrors) : [];
    
    // Add some sample errors if none exist
    if (errorList.length === 0) {
      const sampleErrors: ErrorLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          level: 'error',
          message: 'TypeError: Cannot read property \'id\' of undefined',
          stack: 'at AgentCard (AgentCard.tsx:45:12)\nat ChatPage (ChatPage.tsx:123:8)',
          url: '/chat',
          line: 45,
          column: 12,
          component: 'AgentCard',
          action: 'render'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          level: 'warning',
          message: 'API response time exceeded 2 seconds',
          url: '/api/agents',
          component: 'AgentService',
          action: 'fetchAgents',
          details: { responseTime: 2340, endpoint: '/api/agents' }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          level: 'error',
          message: 'Network request failed: Failed to fetch',
          url: '/api/chat/conversations',
          component: 'ChatService',
          action: 'createConversation'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          level: 'info',
          message: 'User logged in successfully',
          component: 'AuthService',
          action: 'login',
          details: { userId: 'user123', loginMethod: 'email' }
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
          level: 'warning',
          message: 'localStorage quota exceeded, clearing cache',
          component: 'CacheManager',
          action: 'clearCache'
        }
      ];
      
      setErrors(sampleErrors);
      localStorage.setItem('errorLogs', JSON.stringify(sampleErrors));
    } else {
      setErrors(errorList);
    }

    // Calculate stats
    calculateErrorStats(errorList);
  };

  const setupErrorCapture = () => {
    setMonitoring(true);
    
    // Capture JavaScript errors
    window.addEventListener('error', captureError);
    
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', capturePromiseRejection);
    
    // Override console.error to capture manual errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      captureConsoleError(args);
      originalConsoleError.apply(console, args);
    };
  };

  const captureError = (event: ErrorEvent) => {
    const error: ErrorLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: event.message,
      stack: event.error?.stack,
      url: event.filename,
      line: event.lineno,
      column: event.colno,
      userAgent: navigator.userAgent
    };
    
    addErrorToLog(error);
  };

  const capturePromiseRejection = (event: PromiseRejectionEvent) => {
    const error: ErrorLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
      userAgent: navigator.userAgent
    };
    
    addErrorToLog(error);
  };

  const captureConsoleError = (args: any[]) => {
    const error: ErrorLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: args.join(' '),
      userAgent: navigator.userAgent
    };
    
    addErrorToLog(error);
  };

  const addErrorToLog = (error: ErrorLog) => {
    setErrors(prev => {
      const updated = [error, ...prev].slice(0, 100); // Keep last 100 errors
      localStorage.setItem('errorLogs', JSON.stringify(updated));
      calculateErrorStats(updated);
      return updated;
    });
  };

  const calculateErrorStats = (errorList: ErrorLog[]) => {
    const today = new Date().toDateString();
    const todayErrors = errorList.filter(e => new Date(e.timestamp).toDateString() === today);
    
    const errorsToday = todayErrors.filter(e => e.level === 'error').length;
    const warningsToday = todayErrors.filter(e => e.level === 'warning').length;
    
    // Find most common error
    const errorCounts = errorList.reduce((acc, error) => {
      const key = error.message.substring(0, 50);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topError = Object.entries(errorCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
    const lastError = errorList[0]?.message.substring(0, 50) || 'None';
    
    setErrorStats({
      totalErrors: errorList.length,
      errorsToday,
      warningsToday,
      lastError,
      topError,
      errorRate: errorsToday / Math.max(1, errorList.length) * 100
    });
  };

  const filterErrors = () => {
    let filtered = errors;
    
    if (filterLevel !== 'all') {
      filtered = filtered.filter(error => error.level === filterLevel);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(error => 
        error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.component?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.url?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredErrors(filtered);
  };

  const clearErrorLogs = () => {
    setErrors([]);
    setFilteredErrors([]);
    localStorage.removeItem('errorLogs');
    calculateErrorStats([]);
  };

  const exportErrorLogs = () => {
    const data = {
      errors: errors,
      stats: errorStats,
      exportDate: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getErrorIcon = (level: ErrorLog['level']) => {
    switch (level) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Bug className="h-4 w-4 text-gray-500" />;
    }
  };

  const getErrorBadgeColor = (level: ErrorLog['level']) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bug className="h-5 w-5" />
            🐛 Error Tracking & Debugging
          </h3>
          <p className="text-gray-600">View detailed error logs and debugging information</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={exportErrorLogs}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            onClick={clearErrorLogs}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Error Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Errors</p>
                <p className="text-2xl font-bold text-red-800">{errorStats.totalErrors}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Errors Today</p>
                <p className="text-2xl font-bold text-yellow-800">{errorStats.errorsToday}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Warnings Today</p>
                <p className="text-2xl font-bold text-blue-800">{errorStats.warningsToday}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Error Rate</p>
                <p className="text-2xl font-bold text-purple-800">{errorStats.errorRate.toFixed(1)}%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Status */}
      <Alert className={monitoring ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        {monitoring ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        <AlertDescription>
          <strong>Error Monitoring:</strong> {monitoring ? '✅ Active - Capturing errors in real-time' : '❌ Inactive'}
        </AlertDescription>
      </Alert>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              {['all', 'error', 'warning', 'info'].map((level) => (
                <Button
                  key={level}
                  variant={filterLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterLevel(level)}
                  className="capitalize"
                >
                  {level === 'all' ? 'All' : level}
                  {level !== 'all' && (
                    <Badge variant="secondary" className="ml-1">
                      {errors.filter(e => e.level === level).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search errors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Error Logs 
            <span className="text-sm font-normal text-gray-600 ml-2">({filteredErrors.length} entries)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredErrors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bug className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No errors found matching your criteria</p>
              </div>
            ) : (
              filteredErrors.slice(0, 20).map((error) => (
                <div
                  key={error.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedError(error)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getErrorIcon(error.level)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getErrorBadgeColor(error.level)}>
                            {error.level.toUpperCase()}
                          </Badge>
                          {error.component && (
                            <Badge variant="outline">{error.component}</Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(error.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">{error.message}</p>
                        {error.url && (
                          <p className="text-sm text-gray-600">
                            <Code className="h-3 w-3 inline mr-1" />
                            {error.url}{error.line && `:${error.line}:${error.column}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Detail Modal */}
      {selectedError && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Error Details</span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setSelectedError(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Error Message</h4>
                <p className="bg-white p-3 rounded border font-mono text-sm">{selectedError.message}</p>
              </div>
              
              {selectedError.stack && (
                <div>
                  <h4 className="font-semibold mb-2">Stack Trace</h4>
                  <pre className="bg-white p-3 rounded border text-xs overflow-x-auto whitespace-pre-wrap">
                    {selectedError.stack}
                  </pre>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <div className="bg-white p-3 rounded border space-y-1 text-sm">
                    <p><strong>Level:</strong> {selectedError.level}</p>
                    <p><strong>Timestamp:</strong> {new Date(selectedError.timestamp).toLocaleString()}</p>
                    {selectedError.component && <p><strong>Component:</strong> {selectedError.component}</p>}
                    {selectedError.action && <p><strong>Action:</strong> {selectedError.action}</p>}
                    {selectedError.url && <p><strong>URL:</strong> {selectedError.url}</p>}
                    {selectedError.line && <p><strong>Line:</strong> {selectedError.line}:{selectedError.column}</p>}
                  </div>
                </div>
                
                {selectedError.details && (
                  <div>
                    <h4 className="font-semibold mb-2">Additional Data</h4>
                    <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                      {JSON.stringify(selectedError.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debugging Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            💡 Debugging Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">🔍 Common Error Types:</h4>
              <ul className="space-y-1">
                <li>• <strong>TypeError:</strong> Property access on null/undefined</li>
                <li>• <strong>Network errors:</strong> API endpoint issues</li>
                <li>• <strong>Promise rejections:</strong> Async operation failures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🛠️ Debugging Steps:</h4>
              <ul className="space-y-1">
                <li>• Check the stack trace for error location</li>
                <li>• Verify API endpoints are working</li>
                <li>• Look for null checks in components</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
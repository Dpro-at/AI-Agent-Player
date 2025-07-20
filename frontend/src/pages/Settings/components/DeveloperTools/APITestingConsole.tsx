import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { 
  Play, 
  Monitor, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle,
  Activity,
  Code,
  Database,
  Users,
  MessageSquare,
  ShoppingCart,
  Settings,
  Zap,
  Plus,
  Edit,
  Trash2,
  BarChart3
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'auth' | 'users' | 'agents' | 'chat' | 'tasks' | 'licensing' | 'training' | 'marketplace' | 'system';
  description: string;
  responseTime?: number;
  status?: 'success' | 'error' | 'pending';
  lastTested?: string;
}

interface APITestResult {
  endpoint: string;
  method: string;
  status: number;
  responseTime: number;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export const APITestingConsole: React.FC = () => {
  const [endpoints] = useState<APIEndpoint[]>([
    // Auth APIs
    { id: '1', method: 'POST', path: '/auth/login', category: 'auth', description: 'User login' },
    { id: '2', method: 'GET', path: '/auth/me', category: 'auth', description: 'Get current user' },
    { id: '3', method: 'POST', path: '/auth/logout', category: 'auth', description: 'User logout' },
    
    // Users APIs
    { id: '4', method: 'GET', path: '/users/profile', category: 'users', description: 'Get user profile' },
    { id: '5', method: 'PUT', path: '/users/profile', category: 'users', description: 'Update profile' },
    { id: '6', method: 'GET', path: '/users/settings', category: 'users', description: 'Get user settings' },
    
    // Agents APIs
    { id: '7', method: 'GET', path: '/agents', category: 'agents', description: 'List all agents' },
    { id: '8', method: 'POST', path: '/agents', category: 'agents', description: 'Create new agent' },
    { id: '9', method: 'PUT', path: '/agents/{id}', category: 'agents', description: 'Update agent' },
    { id: '10', method: 'DELETE', path: '/agents/{id}', category: 'agents', description: 'Delete agent' },
    
    // Chat APIs
    { id: '11', method: 'GET', path: '/chat/conversations', category: 'chat', description: 'Get conversations' },
    { id: '12', method: 'POST', path: '/chat/conversations', category: 'chat', description: 'Create conversation' },
    { id: '13', method: 'POST', path: '/chat/conversations/{id}/messages', category: 'chat', description: 'Send message' },
    
    // Tasks APIs
    { id: '14', method: 'GET', path: '/task/tasks', category: 'tasks', description: 'List tasks' },
    { id: '15', method: 'POST', path: '/task/tasks', category: 'tasks', description: 'Create task' },
    { id: '16', method: 'PUT', path: '/task/tasks/{id}', category: 'tasks', description: 'Update task' },
    
    // Licensing APIs
    { id: '17', method: 'GET', path: '/license/licensing/status', category: 'licensing', description: 'Get license status' },
    { id: '18', method: 'POST', path: '/license/licensing/validate', category: 'licensing', description: 'Validate license' },
    
    // Training APIs
    { id: '19', method: 'GET', path: '/training/training-lab/workspaces', category: 'training', description: 'List workspaces' },
    { id: '20', method: 'POST', path: '/training/training-lab/workspaces', category: 'training', description: 'Create workspace' },
    
    // Marketplace APIs
    { id: '21', method: 'GET', path: '/market/marketplace/items', category: 'marketplace', description: 'Get marketplace items' },
    { id: '22', method: 'GET', path: '/market/marketplace/categories', category: 'marketplace', description: 'Get categories' },
    
    // System APIs
    { id: '23', method: 'GET', path: '/api/system/health', category: 'system', description: 'System health check' },
    { id: '24', method: 'GET', path: '/api/system/analytics', category: 'system', description: 'System analytics' }
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [testResults, setTestResults] = useState<APITestResult[]>([]);
  const [testing, setTesting] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalTests: 0,
    successRate: 0,
    avgResponseTime: 0,
    lastTestTime: ''
  });

  const categories = [
    { key: 'all', label: 'All APIs', icon: <Database className="h-4 w-4" />, count: endpoints.length },
    { key: 'auth', label: 'Authentication', icon: <Users className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'auth').length },
    { key: 'users', label: 'Users', icon: <Users className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'users').length },
    { key: 'agents', label: 'Agents', icon: <Zap className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'agents').length },
    { key: 'chat', label: 'Chat', icon: <MessageSquare className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'chat').length },
    { key: 'tasks', label: 'Tasks', icon: <CheckCircle className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'tasks').length },
    { key: 'licensing', label: 'Licensing', icon: <Settings className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'licensing').length },
    { key: 'training', label: 'Training', icon: <Activity className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'training').length },
    { key: 'marketplace', label: 'Marketplace', icon: <ShoppingCart className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'marketplace').length },
    { key: 'system', label: 'System', icon: <Settings className="h-4 w-4" />, count: endpoints.filter(e => e.category === 'system').length }
  ];

  const filteredEndpoints = filterCategory === 'all' 
    ? endpoints 
    : endpoints.filter(endpoint => endpoint.category === filterCategory);

  const testAPI = async (endpoint: APIEndpoint) => {
    setTesting(endpoint.id);
    const startTime = Date.now();
    
    try {
      const token = localStorage.getItem('access_token');
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Prepare test data based on method and endpoint
      let body = null;
      if (endpoint.method === 'POST' && endpoint.path.includes('login')) {
        body = JSON.stringify({ email: 'test@example.com', password: 'password' });
      } else if (endpoint.method === 'POST' && endpoint.path.includes('agents')) {
        body = JSON.stringify({ name: 'Test Agent', description: 'Test agent description' });
      } else if (endpoint.method === 'POST' && endpoint.path.includes('conversations')) {
        body = JSON.stringify({ title: 'Test Conversation', agent_id: 1 });
      } else if (endpoint.method === 'POST' && endpoint.path.includes('tasks')) {
        body = JSON.stringify({ title: 'Test Task', description: 'Test task description' });
      }

      const response = await fetch(`http://localhost:8000${endpoint.path}`, {
        method: endpoint.method,
        headers,
        body
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      const result: APITestResult = {
        endpoint: endpoint.path,
        method: endpoint.method,
        status: response.status,
        responseTime,
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.message || 'Request failed' : undefined,
        timestamp: new Date().toLocaleString()
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      updatePerformanceMetrics();
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: APITestResult = {
        endpoint: endpoint.path,
        method: endpoint.method,
        status: 0,
        responseTime,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        timestamp: new Date().toLocaleString()
      };
      
      setTestResults(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setTesting(null);
    }
  };

  const testAllEndpoints = async () => {
    for (const endpoint of filteredEndpoints) {
      await testAPI(endpoint);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
    }
  };

  const updatePerformanceMetrics = () => {
    const total = testResults.length;
    const successful = testResults.filter(r => r.success).length;
    const avgTime = testResults.reduce((sum, r) => sum + r.responseTime, 0) / total;
    
    setPerformanceMetrics({
      totalTests: total,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      avgResponseTime: avgTime,
      lastTestTime: new Date().toLocaleString()
    });
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            📊 API Performance & Testing Console
          </h3>
          <p className="text-gray-600">Monitor API performance and test endpoints</p>
        </div>
        <Button 
          onClick={testAllEndpoints}
          disabled={testing !== null}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Test All ({filteredEndpoints.length})
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Tests</p>
                <p className="text-2xl font-bold text-blue-800">{performanceMetrics.totalTests}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-green-800">{performanceMetrics.successRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Avg Response</p>
                <p className="text-2xl font-bold text-orange-800">{performanceMetrics.avgResponseTime.toFixed(0)}ms</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Last Test</p>
                <p className="text-sm font-semibold text-purple-800">{performanceMetrics.lastTestTime || 'Never'}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            API Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={filterCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category.key)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.label}
                <Badge variant="secondary" className="ml-1">{category.count}</Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filterCategory === 'all' ? 'All API Endpoints' : `${categories.find(c => c.key === filterCategory)?.label} APIs`}
            <span className="text-sm font-normal text-gray-600 ml-2">({filteredEndpoints.length} endpoints)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEndpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Badge className={getMethodBadgeColor(endpoint.method)}>
                    {endpoint.method}
                  </Badge>
                  <div>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                    <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {endpoint.responseTime && (
                    <span className="text-sm text-gray-500">
                      {endpoint.responseTime}ms
                    </span>
                  )}
                  
                  <Button
                    size="sm"
                    onClick={() => testAPI(endpoint)}
                    disabled={testing === endpoint.id}
                    className="flex items-center gap-1"
                  >
                    {testing === endpoint.id ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Test
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.slice(0, 5).map((result, index) => (
                <Alert
                  key={index}
                  className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">
                          {result.method} {result.endpoint}
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.success ? 'Success' : result.error} • {result.responseTime}ms • {result.timestamp}
                        </div>
                      </div>
                    </div>
                    <Badge variant={result.success ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 
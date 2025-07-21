import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Alert } from '../../../../components/ui/alert';
import { 
  Activity, 
  Zap, 
  CheckCircle, 
  Database, 
  Users, 
  MessageSquare, 
  Settings, 
  ShoppingCart,
  Play,
  Clock,
  TrendingUp,
  Filter,
  CheckSquare,
  Square,
  XCircle
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
    { id: '7', method: 'GET', path: '/agents', category: 'agents', description: 'List agents' },
    { id: '8', method: 'POST', path: '/agents', category: 'agents', description: 'Create agent' },
    { id: '9', method: 'GET', path: '/agents/1', category: 'agents', description: 'Get agent' },
    { id: '10', method: 'PUT', path: '/agents/1', category: 'agents', description: 'Update agent' },
    { id: '11', method: 'DELETE', path: '/agents/1', category: 'agents', description: 'Delete agent' },
    
    // Chat APIs - Regular ID-based
    { id: '12', method: 'GET', path: '/chat/conversations', category: 'chat', description: 'List conversations' },
    { id: '13', method: 'POST', path: '/chat/conversations', category: 'chat', description: 'Create conversation' },
    { id: '14', method: 'GET', path: '/chat/conversations/1', category: 'chat', description: 'Get conversation' },
    { id: '15', method: 'PUT', path: '/chat/conversations/1', category: 'chat', description: 'Update conversation' },
    { id: '16', method: 'GET', path: '/chat/conversations/1/messages', category: 'chat', description: 'Get messages' },
    { id: '17', method: 'POST', path: '/chat/conversations/1/messages', category: 'chat', description: 'Send message' },
    { id: '18', method: 'DELETE', path: '/chat/conversations/1', category: 'chat', description: 'Delete conversation' },
    
    // Chat UUID APIs
    { id: '19', method: 'GET', path: '/chat/c/test-uuid-12345', category: 'chat', description: 'Get Conversation by UUID' },
    { id: '20', method: 'PUT', path: '/chat/c/test-uuid-12345', category: 'chat', description: 'Update Conversation by UUID' },
    { id: '21', method: 'GET', path: '/chat/c/test-uuid-12345/messages', category: 'chat', description: 'Get Messages by UUID' },
    { id: '22', method: 'POST', path: '/chat/c/test-uuid-12345/messages', category: 'chat', description: 'Send Message by UUID' },
    { id: '23', method: 'DELETE', path: '/chat/c/test-uuid-12345', category: 'chat', description: 'Delete Conversation by UUID' },
    
    // Tasks APIs
    { id: '24', method: 'GET', path: '/task/tasks', category: 'tasks', description: 'List tasks' },
    { id: '25', method: 'POST', path: '/task/tasks', category: 'tasks', description: 'Create task' },
    { id: '26', method: 'GET', path: '/task/tasks/1', category: 'tasks', description: 'Get task' },
    { id: '27', method: 'PUT', path: '/task/tasks/1', category: 'tasks', description: 'Update task' },
    { id: '28', method: 'DELETE', path: '/task/tasks/1', category: 'tasks', description: 'Delete task' },
    
    // Licensing APIs
    { id: '29', method: 'POST', path: '/license/licensing/validate', category: 'licensing', description: 'Validate license' },
    { id: '30', method: 'GET', path: '/license/licensing/status', category: 'licensing', description: 'Get license status' },
    { id: '31', method: 'POST', path: '/license/licensing/activate', category: 'licensing', description: 'Activate license' },
    
    // Training APIs
    { id: '32', method: 'GET', path: '/training/training-lab/workspaces', category: 'training', description: 'List workspaces' },
    { id: '33', method: 'POST', path: '/training/training-lab/workspaces', category: 'training', description: 'Create workspace' },
    { id: '34', method: 'GET', path: '/training/training-lab/workspaces/1', category: 'training', description: 'Get workspace' },
    
    // Marketplace APIs
    { id: '35', method: 'GET', path: '/market/marketplace/items', category: 'marketplace', description: 'List marketplace items' },
    { id: '36', method: 'GET', path: '/market/marketplace/items/1', category: 'marketplace', description: 'Get marketplace item' },
    { id: '37', method: 'GET', path: '/market/marketplace/categories', category: 'marketplace', description: 'Get categories' },
    
    // System APIs
    { id: '38', method: 'GET', path: '/system_health/health', category: 'system', description: 'System health check' },
    { id: '39', method: 'GET', path: '/system_health/status', category: 'system', description: 'System status' },
    { id: '40', method: 'GET', path: '/system_analytics/overview', category: 'system', description: 'System analytics' },
  ]);

  // CHANGED: Multiple category selection instead of single
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [results, setResults] = useState<APITestResult[]>([]);
  const [testing, setTesting] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalTests: 0,
    successRate: 0,
    avgResponseTime: 0,
    lastTestTime: ''
  });

  // NEW: Smart UUID management for Chat UUID APIs
  const [conversationUUIDs, setConversationUUIDs] = useState<{[key: string]: string}>({});

  // NEW: Get or create real UUID for testing
  const getTestUUID = async (_endpoint: APIEndpoint): Promise<string> => {
    // If we already have a UUID for this test session, use it
    if (conversationUUIDs['test-session']) {
      return conversationUUIDs['test-session'];
    }

    // Create a new conversation to get a real UUID
    try {
      const token = localStorage.getItem('access_token');
      console.log('🔄 Creating test conversation for UUID...');
      
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Test Conversation for UUID APIs ${new Date().toLocaleTimeString()}`,
          agent_id: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📋 Create conversation response:', data);
        
        // FIXED: Use conversation_uuid instead of uuid
        const uuid = data.data?.conversation_uuid;
        if (uuid) {
          // Store UUID for future tests
          setConversationUUIDs(prev => ({
            ...prev,
            'test-session': uuid
          }));
          console.log(`🆔 Created test conversation with UUID: ${uuid}`);
          return uuid;
        } else {
          console.warn('⚠️ No conversation_uuid in response:', data);
        }
      } else {
        console.warn(`⚠️ Failed to create conversation: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.warn('Error response:', errorText);
      }
    } catch (error) {
      console.warn('⚠️ Failed to create test conversation, using dummy UUID:', error);
    }

    // Fallback to dummy UUID
    console.log('⚠️ Using fallback dummy UUID');
    return 'test-uuid-12345';
  };

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

  // UPDATED: Filter logic for multiple categories
  const filteredEndpoints = selectedCategories.includes('all') 
    ? endpoints 
    : endpoints.filter(endpoint => selectedCategories.includes(endpoint.category));

  // NEW: Category selection handlers
  const handleCategoryToggle = (categoryKey: string) => {
    if (categoryKey === 'all') {
      setSelectedCategories(['all']);
    } else {
      let newSelection = [...selectedCategories];
      
      // Remove 'all' if selecting specific categories
      if (newSelection.includes('all')) {
        newSelection = newSelection.filter(cat => cat !== 'all');
      }
      
      // Toggle the category
      if (newSelection.includes(categoryKey)) {
        newSelection = newSelection.filter(cat => cat !== categoryKey);
      } else {
        newSelection.push(categoryKey);
      }
      
      // If no categories selected, default to 'all'
      if (newSelection.length === 0) {
        newSelection = ['all'];
      }
      
      setSelectedCategories(newSelection);
    }
  };

  const handleSelectAll = () => {
    const allSpecificCategories = categories
      .filter(cat => cat.key !== 'all')
      .map(cat => cat.key);
    setSelectedCategories(allSpecificCategories);
  };

  const handleClearAll = () => {
    setSelectedCategories(['all']);
  };

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

      // ENHANCED: Dynamic conversation ID management + UUID support
      let requestUrl = endpoint.path;
      let conversationId = 1; // Default conversation ID
      
      // NEW: Handle UUID-based endpoints
      if (requestUrl.includes('/chat/c/test-uuid-12345')) {
        const realUUID = await getTestUUID(endpoint);
        requestUrl = requestUrl.replace('test-uuid-12345', realUUID);
        console.log(`🆔 Using real UUID: ${realUUID} for ${endpoint.method} ${requestUrl}`);
      }
      
      // For endpoints that need an existing conversation, get or create one
      if (endpoint.path.includes('conversations/1') || endpoint.path.includes('messages')) {
        // Try to get existing conversations first
        if (endpoint.method !== 'POST' || endpoint.path.includes('messages')) {
          try {
            const conversationsResponse = await fetch('http://localhost:8000/chat/conversations', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (conversationsResponse.ok) {
              const conversationsData = await conversationsResponse.json();
              const conversations = conversationsData.data?.conversations || [];
              
              if (conversations.length > 0) {
                conversationId = conversations[0].id;
                console.log(`🔧 Using existing conversation ID: ${conversationId}`);
              } else {
                // Create a new conversation if none exist
                console.log(`🔧 No conversations found, creating new one...`);
                const createResponse = await fetch('http://localhost:8000/chat/conversations', {
                  method: 'POST',
                  headers,
                  body: JSON.stringify({ 
                    title: `Test Conversation for Messages ${new Date().toLocaleTimeString()}`, 
                    agent_id: 1 
                  })
                });
                
                if (createResponse.ok) {
                  const createData = await createResponse.json();
                  conversationId = createData.data?.conversation_id || 1;
                  console.log(`🔧 Created new conversation ID: ${conversationId}`);
                }
              }
            }
          } catch (error) {
            console.log(`🔧 Error getting conversations, using default ID: ${conversationId}`);
          }
        }
      }
      
      // Replace {id} with actual conversation ID
      if (requestUrl.includes('{id}')) {
        if (requestUrl.includes('/agents/')) {
          requestUrl = requestUrl.replace('{id}', '1'); // Use agent ID 1 for testing
        } else if (requestUrl.includes('/chat/')) {
          requestUrl = requestUrl.replace('{id}', conversationId.toString()); // Use actual conversation ID
        } else if (requestUrl.includes('/tasks/')) {
          requestUrl = requestUrl.replace('{id}', '1'); // Use task ID 1 for testing
        }
      }
      
      // For hardcoded URLs, also replace with actual conversation ID
      if (requestUrl === '/chat/conversations/1' || requestUrl === '/chat/conversations/1/messages') {
        requestUrl = requestUrl.replace('/1', `/${conversationId}`);
      }

      // Prepare test data based on method and endpoint - FIXED: Complete Chat API data
      let body = null;
      if (endpoint.method === 'POST' && endpoint.path.includes('login')) {
        body = JSON.stringify({ email: 'test@example.com', password: 'password' });
      } else if (endpoint.method === 'POST' && endpoint.path.includes('agents')) {
        body = JSON.stringify({ name: 'Test Agent', description: 'Test agent description' });
      } else if (endpoint.method === 'POST' && endpoint.path.includes('conversations') && !endpoint.path.includes('messages')) {
        // POST /chat/conversations
        body = JSON.stringify({ 
          title: `Test Conversation ${new Date().toLocaleTimeString()}`, 
          agent_id: 1 
        });
      } else if (endpoint.method === 'POST' && endpoint.path.includes('messages')) {
        // POST /chat/conversations/{id}/messages  
        body = JSON.stringify({ 
          content: `Test message sent at ${new Date().toLocaleTimeString()}`,
          sender_type: "user"
        });
      } else if (endpoint.method === 'PUT' && endpoint.path.includes('conversations')) {
        // PUT /chat/conversations/{id}
        body = JSON.stringify({ 
          title: `Updated Conversation ${new Date().toLocaleTimeString()}`
        });
      } else if (endpoint.method === 'POST' && endpoint.path.includes('tasks')) {
        body = JSON.stringify({ title: 'Test Task', description: 'Test task description' });
      } else if (endpoint.method === 'PUT' && endpoint.path.includes('profile')) {
        // PUT /users/profile
        body = JSON.stringify({ 
          full_name: 'Updated Test User',
          preferences: { theme: 'dark' }
        });
      } else if (endpoint.method === 'POST' && endpoint.path.includes('workspaces')) {
        // POST /training/training-lab/workspaces
        body = JSON.stringify({ 
          name: 'Test Training Workspace',
          agent_id: 1
        });
      }

      // FIXED: Debug logging for testing
      console.log(`🔧 Testing API: ${endpoint.method} ${requestUrl}`);
      console.log(`🔧 Body data:`, body);
      console.log(`🔧 Headers:`, headers);

      console.log(`🔧 Request URL: ${requestUrl}`);
      console.log(`🔧 Request method: ${endpoint.method}`);
      console.log(`🔧 Request headers:`, headers);
      if (body) {
        console.log(`🔧 Request body:`, JSON.parse(body));
      }

      const response = await fetch(`http://localhost:8000${requestUrl}`, {
        method: endpoint.method,
        headers,
        body
      });

      // ENHANCED: Detailed response logging for debugging
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        responseData = { error: 'Failed to parse JSON response', text: await response.text() };
      }
      
      console.log(`📥 Response status: ${response.status}`);
      console.log(`📥 Response data:`, responseData);
      
      // ENHANCED: Show detailed 422 validation errors
      if (response.status === 422) {
        console.error(`❌ VALIDATION ERROR (422) for ${endpoint.method} ${requestUrl}:`);
        console.error(`📄 Request body was:`, body ? JSON.parse(body) : 'No body');
        console.error(`📋 Error details:`, responseData);
        
        if (responseData.detail && Array.isArray(responseData.detail)) {
          console.error(`🔍 Validation issues:`);
          responseData.detail.forEach((error: any, index: number) => {
            console.error(`   ${index + 1}. Field: ${error.loc?.join('.')} - ${error.msg}`);
            console.error(`      Type: ${error.type}, Input: ${error.input}`);
          });
        }
      }

      const responseTime = Date.now() - startTime;
      const isSuccess = response.ok;
      
      // Create proper APITestResult object
      const result: APITestResult = {
        endpoint: endpoint.path,
        method: endpoint.method,
        status: response.status,
        responseTime,
        success: isSuccess,
        data: isSuccess ? responseData : undefined,
        error: !isSuccess ? responseData?.message || responseData?.detail || 'Request failed' : undefined,
        timestamp: new Date().toLocaleString()
      };

      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
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
      
      setResults(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setTesting(null);
    }
  };

  const updatePerformanceMetrics = () => {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const avgTime = results.reduce((sum, r) => sum + r.responseTime, 0) / total;
    
    setPerformanceMetrics({
      totalTests: total,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      avgResponseTime: total > 0 ? Math.round(avgTime) : 0,
      lastTestTime: total > 0 ? new Date().toLocaleTimeString() : ''
    });
  };

  // NEW: Test all endpoints in selected categories
  const testAllEndpoints = async () => {
    if (testing || filteredEndpoints.length === 0) return;
    
    console.log(`🚀 Testing ${filteredEndpoints.length} endpoints...`);
    
    for (const endpoint of filteredEndpoints) {
      await testAPI(endpoint);
      // Small delay between tests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Completed testing ${filteredEndpoints.length} endpoints`);
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
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">Total Tests</span>
            </div>
            <div className="text-2xl font-bold mt-1">{performanceMetrics.totalTests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold mt-1">{performanceMetrics.successRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Avg Response</span>
            </div>
            <div className="text-2xl font-bold mt-1">{performanceMetrics.avgResponseTime}ms</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Last Test</span>
            </div>
            <div className="text-sm font-medium mt-1">{performanceMetrics.lastTestTime || 'None'}</div>
          </CardContent>
        </Card>
      </div>

      {/* UPDATED: Advanced Multi-Select Category Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              🔍 Advanced API Filters
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
                className="text-xs"
              >
                <CheckSquare className="h-3 w-3 mr-1" />
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearAll}
                className="text-xs"
              >
                <Square className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Selected: {selectedCategories.includes('all') ? 'All Categories' : `${selectedCategories.length} categories`}
            {!selectedCategories.includes('all') && selectedCategories.length > 0 && (
              <span className="ml-2 text-blue-600">
                ({selectedCategories.join(', ')})
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.key);
              const isAll = category.key === 'all';
              
              return (
                <div
                  key={category.key}
                  onClick={() => handleCategoryToggle(category.key)}
                  className={`
                    relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                    }
                  `}
                >
                  {/* BIG Checkbox Indicator - TOP LEFT for visibility */}
                  <div className="absolute top-2 left-2 z-10">
                    {isSelected ? (
                      <div className="bg-blue-600 rounded border-2 border-blue-600 p-1">
                        <CheckSquare className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="bg-white rounded border-2 border-gray-300 p-1 hover:border-blue-400">
                        <Square className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Selection Status Badge - TOP RIGHT */}
                  <div className="absolute top-2 right-2">
                    {isSelected && (
                      <Badge className="text-xs bg-green-500 text-white">
                        ✓ Selected
                      </Badge>
                    )}
                  </div>
                  
                  {/* Category Content - with more spacing for checkbox */}
                  <div className="mt-8 space-y-2">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span className="font-medium text-sm">{category.label}</span>
                    </div>
                    
                    <Badge 
                      variant={isSelected ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {category.count} APIs
                    </Badge>
                  </div>
                  
                  {/* Special indicator for "All" */}
                  {isAll && (
                    <div className="absolute bottom-2 right-2">
                      <Badge className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        ⭐ All
                      </Badge>
                    </div>
                  )}
                  
                  {/* Visual Selection Border Effect */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-lg border-2 border-blue-400 pointer-events-none animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Selection Summary */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                📊 Showing {filteredEndpoints.length} endpoints
                {!selectedCategories.includes('all') && (
                  <span className="text-gray-600 ml-1">
                    from {selectedCategories.length} selected categories
                  </span>
                )}
              </span>
              <Button 
                onClick={() => filteredEndpoints.forEach(endpoint => testAPI(endpoint))}
                disabled={testing !== null || filteredEndpoints.length === 0}
                size="sm"
                className="flex items-center gap-1"
              >
                <Play className="h-3 w-3" />
                Test All Selected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategories.includes('all') ? 'All API Endpoints' : `${categories.find(c => selectedCategories.includes(c.key))?.label} APIs`}
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
                    ⚙️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.slice(0, 5).map((result, index) => (
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
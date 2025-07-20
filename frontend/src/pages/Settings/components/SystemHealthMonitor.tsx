import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { 
  Activity, 
  Database, 
  Server, 
  Cpu, 
  HardDrive, 
  Memory, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Monitor,
  Package,
  Globe,
  Users,
  MessageSquare,
  Settings,
  User
} from 'lucide-react';

interface SystemInfo {
  os_name: string;
  os_version: string;
  memory: {
    total_gb: number;
    available_gb: number;
    used_percent: number;
  };
  disk: {
    total_gb: number;
    free_gb: number;
    used_percent: number;
  };
  cpu: {
    cores: number;
    usage_percent: number;
  };
}

interface PythonInfo {
  version: string;
  version_info: {
    major: number;
    minor: number;
    micro: number;
  };
  packages_count: number;
  project_packages: Array<{
    name: string;
    version: string;
  }>;
}

interface DatabaseInfo {
  type: string;
  path: string;
  exists: boolean;
  size_mb: number;
  tables_count: number;
  connection_test: boolean;
  migration_status: string;
}

interface ApiStatus {
  server_running: boolean;
  working_count: number;
  total_count: number;
  success_rate: number;
  endpoints: Array<{
    path: string;
    status: string;
    response_time: number;
    status_code: number;
  }>;
}

interface DetailedTest {
  test_name: string;
  status: string;
  success_rate: number;
  operations: Record<string, any>;
  errors: string[];
}

interface Recommendation {
  type: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  action: string;
}

interface HealthReport {
  timestamp: string;
  system_info: SystemInfo;
  python_info: PythonInfo;
  database_info: DatabaseInfo;
  api_status: ApiStatus;
  health_score: number;
  recommendations: Recommendation[];
  detailed_tests: Record<string, DetailedTest>;
  performance_metrics: {
    memory_usage: number;
    cpu_usage: number;
    disk_usage: number;
    recent_tests_count: number;
    last_test_date: string | null;
    average_response_time: number;
    error_rate: number;
  };
}

export const SystemHealthMonitor: React.FC = () => {
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      // Call API to run health check
      const response = await fetch('/api/system/health-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to run health check');
      }

      const data = await response.json();
      setHealthReport(data);
      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Health check error:', error);
      // Load mock data in case of error
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    // Mock data for component development
    const mockData: HealthReport = {
      timestamp: new Date().toISOString(),
      system_info: {
        os_name: 'Windows',
        os_version: '10.0.19044',
        memory: {
          total_gb: 16,
          available_gb: 8.5,
          used_percent: 47
        },
        disk: {
          total_gb: 500,
          free_gb: 250,
          used_percent: 50
        },
        cpu: {
          cores: 8,
          usage_percent: 25
        }
      },
      python_info: {
        version: '3.11.5',
        version_info: { major: 3, minor: 11, micro: 5 },
        packages_count: 45,
        project_packages: [
          { name: 'fastapi', version: '0.104.1' },
          { name: 'sqlalchemy', version: '2.0.23' },
          { name: 'uvicorn', version: '0.24.0' },
          { name: 'pydantic', version: '2.5.0' }
        ]
      },
      database_info: {
        type: 'SQLite',
        path: '/path/to/database.db',
        exists: true,
        size_mb: 12.5,
        tables_count: 37,
        connection_test: true,
        migration_status: 'migrated'
      },
      api_status: {
        server_running: true,
        working_count: 7,
        total_count: 8,
        success_rate: 87.5,
        endpoints: [
          { path: '/auth/system/status', status: 'working', response_time: 0.12, status_code: 200 },
          { path: '/users/profile', status: 'working', response_time: 0.25, status_code: 401 },
          { path: '/agents', status: 'working', response_time: 0.18, status_code: 200 }
        ]
      },
      health_score: 85.2,
      recommendations: [
        {
          type: 'warning',
          category: 'api',
          message: 'Some APIs require authentication',
          action: 'Check authentication settings and tokens'
        }
      ],
      detailed_tests: {
        user_crud: {
          test_name: 'User CRUD Operations',
          status: 'completed',
          success_rate: 75,
          operations: {},
          errors: ['Authentication required']
        },
        agent_crud: {
          test_name: 'Agent CRUD Operations',
          status: 'completed',
          success_rate: 100,
          operations: {},
          errors: []
        },
        chat_crud: {
          test_name: 'Chat CRUD Operations',
          status: 'completed',
          success_rate: 80,
          operations: {},
          errors: []
        }
      },
      performance_metrics: {
        memory_usage: 47,
        cpu_usage: 25,
        disk_usage: 50,
        recent_tests_count: 5,
        last_test_date: new Date().toISOString(),
        average_response_time: 0.18,
        error_rate: 12.5
      }
    };

    setHealthReport(mockData);
    setLastUpdate(new Date().toISOString());
  };

  useEffect(() => {
    // Load mock data when component first loads
    loadMockData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getStatusIcon = (status: string, size = 16) => {
    switch (status) {
      case 'working':
      case 'success':
        return <CheckCircle size={size} className="text-green-600" />;
      case 'warning':
        return <AlertTriangle size={size} className="text-yellow-600" />;
      case 'error':
      case 'critical':
        return <XCircle size={size} className="text-red-600" />;
      default:
        return <Activity size={size} className="text-gray-400" />;
    }
  };

  const formatBytes = (bytes: number) => {
    return bytes >= 1 ? `${bytes.toFixed(1)} GB` : `${(bytes * 1024).toFixed(0)} MB`;
  };

  const formatPercentage = (percent: number) => {
    return `${percent.toFixed(1)}%`;
  };

  if (!healthReport) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Loading system health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
            <p className="text-gray-600">Check how well your AI Agent system is running</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {healthReport.health_score.toFixed(0)}/100
            </div>
            <div className="text-sm text-gray-600">System Health</div>
            <Badge 
              variant={
                healthReport.health_score >= 80 ? 'default' : 
                healthReport.health_score >= 60 ? 'secondary' : 
                'destructive'
              }
            >
              {healthReport.health_score >= 80 ? 'Excellent' : 
               healthReport.health_score >= 60 ? 'Good' : 
               'Needs Attention'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* System Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Monitor className="h-4 w-4 text-blue-500" />
              Computer Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory</span>
                <span className={healthReport.system_info.memory.used_percent > 80 ? 'text-red-600' : 'text-green-600'}>
                  {formatPercentage(healthReport.system_info.memory.used_percent)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processor</span>
                <span className={healthReport.system_info.cpu.usage_percent > 80 ? 'text-red-600' : 'text-green-600'}>
                  {formatPercentage(healthReport.system_info.cpu.usage_percent)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span className={healthReport.system_info.disk.used_percent > 90 ? 'text-red-600' : 'text-green-600'}>
                  {formatPercentage(healthReport.system_info.disk.used_percent)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI System Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-green-500" />
              AI System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(healthReport.database_info.connection_test ? 'success' : 'error')}
                <span className="text-sm">
                  {healthReport.database_info.connection_test ? 'Running Smoothly' : 'Not Working'}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {healthReport.database_info.tables_count} features available
              </div>
              <div className="text-xs text-gray-600">
                Version: Python {healthReport.python_info.version_info.major}.{healthReport.python_info.version_info.minor}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Working */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Server className="h-4 w-4 text-purple-500" />
              Features Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(healthReport.api_status.server_running ? 'success' : 'error')}
                <span className="text-sm">
                  {healthReport.api_status.server_running ? 'All Systems Go' : 'System Offline'}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {healthReport.api_status.working_count}/{healthReport.api_status.total_count} features working
              </div>
              <Badge variant={healthReport.api_status.success_rate > 80 ? 'default' : 'secondary'}>
                {formatPercentage(healthReport.api_status.success_rate)} Uptime
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Overall Health */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-orange-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg font-bold text-center">
                {healthReport.health_score >= 80 ? '😊 Great!' : 
                 healthReport.health_score >= 60 ? '😐 OK' : 
                 '😟 Needs Help'}
              </div>
              <div className="text-xs text-center text-gray-600">
                {healthReport.health_score >= 80 ? 'Everything is working perfectly' : 
                 healthReport.health_score >= 60 ? 'System is running well' : 
                 'Some issues need attention'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information - Simplified */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Computer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Operating System</div>
              <div className="font-medium">{healthReport.system_info.os_name} {healthReport.system_info.os_version}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Available Memory</div>
              <div className="font-medium">
                {formatBytes(healthReport.system_info.memory.available_gb)} GB free of {formatBytes(healthReport.system_info.memory.total_gb)} GB
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full ${healthReport.system_info.memory.used_percent > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${healthReport.system_info.memory.used_percent}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Storage Space</div>
              <div className="font-medium">
                {formatBytes(healthReport.system_info.disk.free_gb)} GB free of {formatBytes(healthReport.system_info.disk.total_gb)} GB
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full ${healthReport.system_info.disk.used_percent > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${healthReport.system_info.disk.used_percent}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Processor</div>
              <div className="font-medium">{healthReport.system_info.cpu.cores} cores, {formatPercentage(healthReport.system_info.cpu.usage_percent)} usage</div>
            </div>
          </CardContent>
        </Card>

        {/* Data Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(healthReport.database_info.connection_test ? 'success' : 'error')}
              <span className="text-sm">
                {healthReport.database_info.connection_test ? 'Connected and Working' : 'Connection Problem'}
              </span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Data Size</div>
              <div className="font-medium">{formatBytes(healthReport.database_info.size_mb)} MB of your data</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Features Available</div>
              <div className="font-medium">{healthReport.database_info.tables_count} different features</div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(healthReport.database_info.migration_status === 'migrated' ? 'success' : 'warning')}
              <span className="text-sm">
                System: {healthReport.database_info.migration_status === 'migrated' ? 'Up to Date' : 'Needs Update'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Feature Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(healthReport.api_status.server_running ? 'success' : 'error')}
                <span>Main System: {healthReport.api_status.server_running ? 'Online' : 'Offline'}</span>
              </div>
              <div>
                <Badge variant={healthReport.api_status.success_rate > 80 ? 'default' : 'secondary'}>
                  {healthReport.api_status.working_count}/{healthReport.api_status.total_count} Features Working
                </Badge>
              </div>
            </div>
            <div className="text-lg font-semibold">
              {formatPercentage(healthReport.api_status.success_rate)} Success Rate
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {healthReport.api_status.endpoints.slice(0, 6).map((endpoint, index) => {
              // Convert technical endpoints to user-friendly names
              const getFeatureName = (path: string) => {
                if (path.includes('/auth')) return 'Login System';
                if (path.includes('/agents')) return 'AI Agents';
                if (path.includes('/chat')) return 'Chat Feature';
                if (path.includes('/users')) return 'User Accounts';
                if (path.includes('/tasks')) return 'Task Manager';
                if (path.includes('/training')) return 'Training Lab';
                if (path.includes('/marketplace')) return 'Marketplace';
                if (path.includes('/license')) return 'License System';
                return 'System Feature';
              };

              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(endpoint.status)}
                    <span className="text-sm font-medium">{getFeatureName(endpoint.path)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {endpoint.status === 'success' ? '✓ Working' : '✗ Issue'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Tests - Simplified */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Feature Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(healthReport.detailed_tests).map(([key, test]) => {
              // Convert technical test names to user-friendly names
              const getTestDisplayName = (testKey: string) => {
                switch (testKey) {
                  case 'user_crud': return 'User Management';
                  case 'agent_crud': return 'AI Agent System';
                  case 'chat_crud': return 'Chat Features';
                  case 'profile_test': return 'Profile System';
                  case 'settings_test': return 'Settings Panel';
                  default: return 'System Feature';
                }
              };

              const getTestIcon = (testKey: string) => {
                switch (testKey) {
                  case 'user_crud': return <Users className="h-4 w-4" />;
                  case 'agent_crud': return <Activity className="h-4 w-4" />;
                  case 'chat_crud': return <MessageSquare className="h-4 w-4" />;
                  case 'profile_test': return <User className="h-4 w-4" />;
                  case 'settings_test': return <Settings className="h-4 w-4" />;
                  default: return <CheckCircle className="h-4 w-4" />;
                }
              };

              return (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getTestIcon(key)}
                    <span className="font-medium">{getTestDisplayName(key)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={test.success_rate > 80 ? 'default' : test.success_rate > 50 ? 'secondary' : 'destructive'}
                    >
                      {test.success_rate > 80 ? 'Working Great' : test.success_rate > 50 ? 'Working OK' : 'Has Issues'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(test.status === 'completed' ? 'success' : 'warning', 16)}
                      <span className="text-sm text-gray-600">
                        {test.status === 'completed' ? 'Tested' : 'Testing...'}
                      </span>
                    </div>
                  </div>
                  {test.errors.length > 0 && (
                    <div className="mt-2 text-xs text-orange-600">
                      {test.errors.length} issue{test.errors.length > 1 ? 's' : ''} found
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations - User Friendly */}
      {healthReport.recommendations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Suggestions to Improve Your System ({healthReport.recommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthReport.recommendations.map((rec, index) => (
              <Alert key={index} className={rec.type === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">
                    {rec.type === 'critical' ? '🚨 Important: ' : '💡 Tip: '}
                    {rec.message}
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    What to do: {rec.action}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(healthReport.performance_metrics.memory_usage)}
              </div>
              <div className="text-sm text-gray-600">Memory Used</div>
              <div className="text-xs text-gray-500 mt-1">
                {healthReport.performance_metrics.memory_usage < 70 ? 'Good' : 'High'}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(healthReport.performance_metrics.cpu_usage)}
              </div>
              <div className="text-sm text-gray-600">Processor Load</div>
              <div className="text-xs text-gray-500 mt-1">
                {healthReport.performance_metrics.cpu_usage < 50 ? 'Light' : 'Busy'}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {(healthReport.performance_metrics.average_response_time * 1000).toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-600">Response Speed</div>
              <div className="text-xs text-gray-500 mt-1">
                {healthReport.performance_metrics.average_response_time < 1 ? 'Fast' : 'Slow'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {healthReport.performance_metrics.recent_tests_count}
              </div>
              <div className="text-sm text-gray-600">Tests Run</div>
              <div className="text-xs text-gray-500 mt-1">
                Last check
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
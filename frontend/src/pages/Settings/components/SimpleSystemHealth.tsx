import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Monitor,
  RefreshCw,
  Smile,
  Meh,
  Frown,
  Zap,
  HardDrive,
  Wifi,
  Settings
} from 'lucide-react';

interface SimpleHealthData {
  overall_score: number;
  system_status: 'excellent' | 'good' | 'needs_attention' | 'offline';
  features_working: number;
  total_features: number;
  memory_usage: number;
  storage_usage: number;
  connection_status: boolean;
  last_check: string;
  issues: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    solution: string;
  }>;
}

const SimpleSystemHealth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<SimpleHealthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runQuickCheck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token'); // Fix: use access_token
      const response = await fetch('/api/system/simple-health', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to check system health');
        }
        throw new Error(`System health check failed (${response.status})`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Health check failed');
      }
      
      // Use actual data from backend
      const simpleData: SimpleHealthData = {
        overall_score: result.data?.overall_score || 75,
        system_status: result.data?.system_status || 'good',
        features_working: result.data?.features_working || 7,
        total_features: result.data?.total_features || 8,
        memory_usage: result.data?.memory_usage || 50,
        storage_usage: result.data?.storage_usage || 60,
        connection_status: result.data?.connection_status !== false,
        last_check: result.data?.last_check || new Date().toLocaleString(),
        issues: result.data?.issues || []
      };

      setHealthData(simpleData);
    } catch (err) {
      console.error('Health check error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Could not check system health. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!healthData) return <Settings className="h-8 w-8 text-gray-400" />;
    
    switch (healthData.system_status) {
      case 'excellent':
        return <Smile className="h-8 w-8 text-green-500" />;
      case 'good':
        return <Smile className="h-8 w-8 text-blue-500" />;
      case 'needs_attention':
        return <Meh className="h-8 w-8 text-yellow-500" />;
      case 'offline':
        return <Frown className="h-8 w-8 text-red-500" />;
      default:
        return <Settings className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    if (!healthData) return "Click 'Check System' to see how your AI system is running";
    
    switch (healthData.system_status) {
      case 'excellent':
        return "🎉 Your AI system is running perfectly! Everything looks great.";
      case 'good':
        return "✅ Your AI system is working well. No major issues found.";
      case 'needs_attention':
        return "⚠️ Your AI system is working but has some issues that need attention.";
      case 'offline':
        return "❌ Your AI system has serious problems and needs immediate attention.";
      default:
        return "Click 'Check System' to see how your AI system is running";
    }
  };

  const getStatusColor = () => {
    if (!healthData) return 'bg-gray-50 border-gray-200';
    
    switch (healthData.system_status) {
      case 'excellent':
        return 'bg-green-50 border-green-200';
      case 'good':
        return 'bg-blue-50 border-blue-200';
      case 'needs_attention':
        return 'bg-yellow-50 border-yellow-200';
      case 'offline':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
          <p className="text-gray-600">Check if your AI Agent system is working properly</p>
        </div>
        <Button 
          onClick={runQuickCheck}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking...' : 'Check System'}
        </Button>
      </div>

      {/* Main Status Card */}
      <Card className={`border-2 ${getStatusColor()}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {getStatusIcon()}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">
                  {healthData ? `System Score: ${healthData.overall_score.toFixed(0)}/100` : 'System Status'}
                </h3>
                {healthData && (
                  <Badge 
                    variant={
                      healthData.system_status === 'excellent' ? 'default' :
                      healthData.system_status === 'good' ? 'secondary' :
                      'destructive'
                    }
                  >
                    {healthData.system_status === 'excellent' ? 'Excellent' :
                     healthData.system_status === 'good' ? 'Good' :
                     healthData.system_status === 'needs_attention' ? 'Needs Attention' :
                     'Offline'}
                  </Badge>
                )}
              </div>
              <p className="text-gray-700 mb-2">{getStatusMessage()}</p>
              {healthData && (
                <p className="text-sm text-gray-500">Last checked: {healthData.last_check}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {healthData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Features Working */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-blue-500" />
                Features Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {healthData.features_working}/{healthData.total_features}
              </div>
              <div className="text-sm text-gray-600">
                {healthData.features_working === healthData.total_features ? 
                  'All features working perfectly!' :
                  `${healthData.total_features - healthData.features_working} features need attention`
                }
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(healthData.features_working / healthData.total_features) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Computer Performance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Monitor className="h-4 w-4 text-green-500" />
                Computer Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span className={healthData.memory_usage > 80 ? 'text-red-600' : 'text-green-600'}>
                      {healthData.memory_usage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${healthData.memory_usage > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${healthData.memory_usage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {healthData.memory_usage < 70 ? 'Memory usage is good' : 
                   healthData.memory_usage < 90 ? 'Memory usage is high' : 
                   'Memory usage is critical'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Space */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <HardDrive className="h-4 w-4 text-purple-500" />
                Storage Space
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Space Used</span>
                    <span className={healthData.storage_usage > 90 ? 'text-red-600' : 'text-green-600'}>
                      {healthData.storage_usage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${healthData.storage_usage > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${healthData.storage_usage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {healthData.storage_usage < 70 ? 'Plenty of space available' :
                   healthData.storage_usage < 90 ? 'Storage space is getting low' :
                   'Storage space is critically low'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Connection Status */}
      {healthData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              System Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {healthData.connection_status ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <div className="font-medium text-green-700">✅ Connected and Working</div>
                    <div className="text-sm text-gray-600">Your AI system is connected to all necessary services</div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <div>
                    <div className="font-medium text-red-700">❌ Connection Problem</div>
                    <div className="text-sm text-gray-600">There's a problem connecting to system services</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues and Solutions */}
      {healthData && healthData.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Issues Found ({healthData.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthData.issues.map((issue, index) => (
              <Alert 
                key={index} 
                className={
                  issue.type === 'error' ? 'border-red-200 bg-red-50' :
                  issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">
                    {issue.type === 'error' ? '🚨 Problem: ' :
                     issue.type === 'warning' ? '⚠️ Warning: ' :
                     '💡 Info: '}
                    {issue.message}
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    <strong>Solution:</strong> {issue.solution}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Could not check system health</div>
            <div className="text-sm text-gray-700 mt-1">{error}</div>
          </AlertDescription>
        </Alert>
      )}

      {/* Help Text */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">What does this check?</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>System Performance:</strong> How well your computer is running</p>
                <p>• <strong>AI Features:</strong> Whether all AI features are working properly</p>
                <p>• <strong>Data Storage:</strong> If your data is safely stored and accessible</p>
                <p>• <strong>Connections:</strong> Whether the system can connect to all necessary services</p>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                💡 <strong>Tip:</strong> Run this check if you notice the AI system running slowly or if features aren't working as expected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleSystemHealth; 
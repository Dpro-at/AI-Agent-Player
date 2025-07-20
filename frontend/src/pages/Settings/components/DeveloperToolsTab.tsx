import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Settings, 
  Monitor, 
  Bug, 
  Trash2, 
  Database,
  Activity,
  Terminal,
  Code,
  Zap,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { APITestingConsole } from './DeveloperTools/APITestingConsole';
import { CacheManagement } from './DeveloperTools/CacheManagement';
import { ErrorTracking } from './DeveloperTools/ErrorTracking';
import { EnvironmentEditor } from './DeveloperTools/EnvironmentEditor';
import { PerformanceMonitor } from './DeveloperTools/PerformanceMonitor';

interface DeveloperToolsTabProps {
  settingsJson: any;
  setSettingsJson: (settings: any) => void;
}

type DeveloperTool = 'api-testing' | 'cache-management' | 'error-tracking' | 'env-editor' | 'performance-monitor';

const DeveloperToolsTab: React.FC<DeveloperToolsTabProps> = ({
  settingsJson,
  setSettingsJson
}) => {
  const [activeTool, setActiveTool] = useState<DeveloperTool | null>(null);

  const tools = [
    {
      id: 'api-testing' as DeveloperTool,
      title: 'API Performance & Testing',
      description: 'Monitor API response times and test endpoints with console',
      icon: <Monitor className="h-6 w-6 text-blue-500" />,
      badge: 'Combined',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'performance-monitor' as DeveloperTool,
      title: 'Real-Time Performance Monitor',
      description: 'Monitor CPU, memory, FPS and system metrics in real-time',
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
      badge: 'Live',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 'error-tracking' as DeveloperTool,
      title: 'Error Tracking',
      description: 'View detailed error logs and debugging information',
      icon: <Bug className="h-6 w-6 text-red-500" />,
      badge: 'Debug',
      color: 'bg-red-50 border-red-200 hover:bg-red-100'
    },
    {
      id: 'cache-management' as DeveloperTool,
      title: 'Cache Management',
      description: 'Clear cache, reset data, and manage storage',
      icon: <Trash2 className="h-6 w-6 text-orange-500" />,
      badge: 'Storage',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    },
    {
      id: 'env-editor' as DeveloperTool,
      title: 'Environment Editor',
      description: 'Edit .env configuration and environment variables',
      icon: <Code className="h-6 w-6 text-purple-500" />,
      badge: 'Config',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    }
  ];

  const renderToolContent = () => {
    switch (activeTool) {
      case 'api-testing':
        return <APITestingConsole />;
      case 'performance-monitor':
        return <PerformanceMonitor />;
      case 'cache-management':
        return <CacheManagement />;
      case 'error-tracking':
        return <ErrorTracking />;
      case 'env-editor':
        return <EnvironmentEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            🛠️ Advanced Developer Tools
          </h2>
          <p className="text-gray-600">Professional development and debugging tools</p>
        </div>
        {activeTool && (
          <Button 
            onClick={() => setActiveTool(null)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Back to Tools
          </Button>
        )}
      </div>

      {!activeTool ? (
        <>
          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className={`cursor-pointer transition-all duration-200 border-2 ${tool.color}`}
                onClick={() => setActiveTool(tool.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {tool.icon}
                      <span className="text-lg">{tool.title}</span>
                    </div>
                    <Badge variant="secondary">{tool.badge}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{tool.description}</p>
                  <div className="mt-3 flex items-center text-sm text-blue-600">
                    <Terminal className="h-4 w-4 mr-1" />
                    Click to open tool
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">API Status</p>
                    <p className="text-2xl font-bold text-blue-800">98.5%</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Performance</p>
                    <p className="text-2xl font-bold text-green-800">Good</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Cache Size</p>
                    <p className="text-2xl font-bold text-orange-800">2.3 MB</p>
                  </div>
                  <Database className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Errors Today</p>
                    <p className="text-2xl font-bold text-red-800">3</p>
                  </div>
                  <Bug className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Environment</p>
                    <p className="text-2xl font-bold text-purple-800">Dev</p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Developer Tips */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Terminal className="h-5 w-5" />
                💡 Developer Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2">🚀 Performance Tips:</h4>
                  <ul className="space-y-1">
                    <li>• Monitor real-time performance metrics</li>
                    <li>• Clear cache regularly for optimal performance</li>
                    <li>• Test API response times regularly</li>
                    <li>• Check error logs for issues</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🔧 Development Tips:</h4>
                  <ul className="space-y-1">
                    <li>• Use environment editor for config changes</li>
                    <li>• Test APIs before production deployment</li>
                    <li>• Track errors for effective debugging</li>
                    <li>• Monitor system resources usage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Tool Content */
        <div className="bg-white rounded-lg border">
          {renderToolContent()}
        </div>
      )}
    </div>
  );
};

export default DeveloperToolsTab; 
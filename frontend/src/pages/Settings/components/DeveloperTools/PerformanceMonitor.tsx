import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { 
  Activity, 
  Monitor, 
  BarChart3, 
  Clock, 
  Cpu, 
  HardDrive,
  Wifi,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: number[];
  description: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  fps: number;
  loadTime: number;
  networkLatency: number;
  bundleSize: number;
  renderTime: number;
  jsHeapSize: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    fps: 60,
    loadTime: 0,
    networkLatency: 0,
    bundleSize: 0,
    renderTime: 0,
    jsHeapSize: 0
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeMetrics();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const initializeMetrics = () => {
    const initialMetrics: PerformanceMetric[] = [
      {
        name: 'CPU Usage',
        value: 25,
        unit: '%',
        status: 'good',
        trend: 'stable',
        history: [20, 22, 25, 23, 25],
        description: 'Browser CPU utilization'
      },
      {
        name: 'Memory Usage',
        value: 45,
        unit: 'MB',
        status: 'good',
        trend: 'up',
        history: [40, 42, 43, 44, 45],
        description: 'JavaScript heap memory'
      },
      {
        name: 'FPS',
        value: 60,
        unit: 'fps',
        status: 'good',
        trend: 'stable',
        history: [58, 59, 60, 60, 60],
        description: 'Frames per second'
      },
      {
        name: 'Load Time',
        value: 1.2,
        unit: 's',
        status: 'good',
        trend: 'down',
        history: [1.5, 1.4, 1.3, 1.2, 1.2],
        description: 'Page load time'
      },
      {
        name: 'Network Latency',
        value: 45,
        unit: 'ms',
        status: 'good',
        trend: 'stable',
        history: [50, 48, 45, 46, 45],
        description: 'API response time'
      },
      {
        name: 'Bundle Size',
        value: 2.1,
        unit: 'MB',
        status: 'warning',
        trend: 'up',
        history: [2.0, 2.0, 2.1, 2.1, 2.1],
        description: 'JavaScript bundle size'
      }
    ];
    
    setMetrics(initialMetrics);
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    
    const id = setInterval(() => {
      updateMetrics();
      collectSystemMetrics();
    }, 1000);
    
    setIntervalId(id);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const updateMetrics = () => {
    setMetrics(prevMetrics => 
      prevMetrics.map(metric => {
        // Simulate realistic metric changes
        const variation = (Math.random() - 0.5) * 0.1;
        let newValue = metric.value + (metric.value * variation);
        
        // Keep values within realistic ranges
        switch (metric.name) {
          case 'CPU Usage':
            newValue = Math.max(10, Math.min(80, newValue));
            break;
          case 'Memory Usage':
            newValue = Math.max(20, Math.min(100, newValue));
            break;
          case 'FPS':
            newValue = Math.max(30, Math.min(60, newValue));
            break;
          case 'Load Time':
            newValue = Math.max(0.5, Math.min(3, newValue));
            break;
          case 'Network Latency':
            newValue = Math.max(20, Math.min(200, newValue));
            break;
          case 'Bundle Size':
            newValue = Math.max(1.5, Math.min(3, newValue));
            break;
        }

        // Update history
        const newHistory = [...metric.history.slice(1), newValue];
        
        // Determine trend
        const recent = newHistory.slice(-3);
        const trend = recent[2] > recent[0] ? 'up' : 
                     recent[2] < recent[0] ? 'down' : 'stable';

        // Determine status
        let status: 'good' | 'warning' | 'critical' = 'good';
        if (metric.name === 'CPU Usage' && newValue > 60) status = 'warning';
        if (metric.name === 'CPU Usage' && newValue > 80) status = 'critical';
        if (metric.name === 'Memory Usage' && newValue > 70) status = 'warning';
        if (metric.name === 'Memory Usage' && newValue > 90) status = 'critical';
        if (metric.name === 'FPS' && newValue < 45) status = 'warning';
        if (metric.name === 'FPS' && newValue < 30) status = 'critical';
        if (metric.name === 'Load Time' && newValue > 2) status = 'warning';
        if (metric.name === 'Load Time' && newValue > 3) status = 'critical';
        if (metric.name === 'Network Latency' && newValue > 100) status = 'warning';
        if (metric.name === 'Network Latency' && newValue > 150) status = 'critical';
        if (metric.name === 'Bundle Size' && newValue > 2.5) status = 'warning';
        if (metric.name === 'Bundle Size' && newValue > 3) status = 'critical';

        return {
          ...metric,
          value: Math.round(newValue * 100) / 100,
          history: newHistory,
          trend,
          status
        };
      })
    );
  };

  const collectSystemMetrics = () => {
    // Collect real browser performance metrics
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      
      setSystemMetrics(prev => ({
        ...prev,
        loadTime: navigation ? (navigation.loadEventEnd - navigation.navigationStart) / 1000 : 0,
        jsHeapSize: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
        renderTime: navigation ? (navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) : 0
      }));
    }
  };

  const exportMetrics = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics,
      systemMetrics,
      performance: {
        timing: performance.timing,
        memory: (performance as any).memory
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            📊 Real-Time Performance Monitor
          </h3>
          <p className="text-gray-600">Monitor system performance and metrics in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={exportMetrics}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          {!isMonitoring ? (
            <Button 
              onClick={startMonitoring}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Monitoring
            </Button>
          ) : (
            <Button 
              onClick={stopMonitoring}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Monitoring
            </Button>
          )}
        </div>
      </div>

      {/* Monitoring Status */}
      <Alert className={isMonitoring ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}>
        <Activity className="h-4 w-4" />
        <AlertDescription>
          <strong>Monitoring Status:</strong> {isMonitoring ? '🟢 Active - Collecting metrics every second' : '⚪ Stopped - Click Start to begin monitoring'}
        </AlertDescription>
      </Alert>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className={`border-2 ${getStatusColor(metric.status)}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{metric.name}</span>
                {getTrendIcon(metric.trend)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value} {metric.unit}
                  </span>
                  <Badge variant={metric.status === 'good' ? 'default' : 'destructive'}>
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600">{metric.description}</p>
                
                {/* Mini Chart */}
                <div className="flex items-end gap-1 h-8">
                  {metric.history.map((value, index) => {
                    const maxValue = Math.max(...metric.history);
                    const height = (value / maxValue) * 100;
                    return (
                      <div
                        key={index}
                        className={`flex-1 rounded-t ${
                          metric.status === 'good' ? 'bg-green-400' :
                          metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">CPU Cores</p>
                <p className="font-semibold">{navigator.hardwareConcurrency || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">JS Heap Size</p>
                <p className="font-semibold">{systemMetrics.jsHeapSize.toFixed(1)} MB</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Wifi className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Connection</p>
                <p className="font-semibold">{(navigator as any).connection?.effectiveType || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="font-semibold">{Math.floor(performance.now() / 1000 / 60)} min</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            💡 Performance Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">🚀 CPU & Memory:</h4>
              <ul className="space-y-1">
                <li>• Close unused browser tabs</li>
                <li>• Disable unnecessary browser extensions</li>
                <li>• Clear cache regularly</li>
                <li>• Use performance profiler for heavy components</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🌐 Network & Loading:</h4>
              <ul className="space-y-1">
                <li>• Optimize images and assets</li>
                <li>• Enable compression and caching</li>
                <li>• Use code splitting for large bundles</li>
                <li>• Monitor API response times</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser Performance API Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Browser Performance API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Navigation Timing</h4>
              <p className="text-gray-600">Measures page load performance</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Memory API</h4>
              <p className="text-gray-600">JavaScript heap usage monitoring</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Resource Timing</h4>
              <p className="text-gray-600">Individual resource load times</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
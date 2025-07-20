import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { 
  Trash2, 
  Database, 
  RefreshCw, 
  HardDrive, 
  Image, 
  FileText, 
  Code, 
  Folder,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Upload,
  Clock
} from 'lucide-react';

interface CacheItem {
  type: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'images' | 'styles' | 'scripts' | 'fonts';
  name: string;
  size: string;
  count: number;
  lastModified: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface CacheStats {
  totalSize: string;
  totalItems: number;
  lastCleared: string;
  storageUsage: number;
}

export const CacheManagement: React.FC = () => {
  const [cacheItems, setCacheItems] = useState<CacheItem[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalSize: '0 KB',
    totalItems: 0,
    lastCleared: 'Never',
    storageUsage: 0
  });
  const [clearing, setClearing] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<string>('');

  useEffect(() => {
    loadCacheData();
  }, []);

  const loadCacheData = () => {
    // Calculate localStorage size
    const localStorageSize = new Blob(Object.values(localStorage)).size;
    const sessionStorageSize = new Blob(Object.values(sessionStorage)).size;
    
    // Get cache items with estimated sizes
    const items: CacheItem[] = [
      {
        type: 'localStorage',
        name: 'Local Storage',
        size: formatBytes(localStorageSize),
        count: Object.keys(localStorage).length,
        lastModified: getStorageLastModified('localStorage'),
        icon: <Database className="h-5 w-5" />,
        color: 'bg-blue-50 border-blue-200',
        description: 'User preferences, auth tokens, and application state'
      },
      {
        type: 'sessionStorage',
        name: 'Session Storage',
        size: formatBytes(sessionStorageSize),
        count: Object.keys(sessionStorage).length,
        lastModified: getStorageLastModified('sessionStorage'),
        icon: <Clock className="h-5 w-5" />,
        color: 'bg-green-50 border-green-200',
        description: 'Temporary session data and form states'
      },
      {
        type: 'indexedDB',
        name: 'IndexedDB',
        size: 'Calculating...',
        count: 0,
        lastModified: 'Unknown',
        icon: <HardDrive className="h-5 w-5" />,
        color: 'bg-purple-50 border-purple-200',
        description: 'Large structured data and offline storage'
      },
      {
        type: 'images',
        name: 'Image Cache',
        size: '1.2 MB',
        count: 45,
        lastModified: new Date().toLocaleDateString(),
        icon: <Image className="h-5 w-5" />,
        color: 'bg-orange-50 border-orange-200',
        description: 'Cached images, avatars, and media files'
      },
      {
        type: 'styles',
        name: 'CSS Styles',
        size: '256 KB',
        count: 12,
        lastModified: new Date().toLocaleDateString(),
        icon: <FileText className="h-5 w-5" />,
        color: 'bg-pink-50 border-pink-200',
        description: 'Compiled CSS, themes, and styling assets'
      },
      {
        type: 'scripts',
        name: 'JavaScript Cache',
        size: '2.1 MB',
        count: 28,
        lastModified: new Date().toLocaleDateString(),
        icon: <Code className="h-5 w-5" />,
        color: 'bg-yellow-50 border-yellow-200',
        description: 'Compiled JavaScript, React components, and libraries'
      },
      {
        type: 'fonts',
        name: 'Font Cache',
        size: '180 KB',
        count: 8,
        lastModified: new Date().toLocaleDateString(),
        icon: <FileText className="h-5 w-5" />,
        color: 'bg-indigo-50 border-indigo-200',
        description: 'Web fonts and typography assets'
      }
    ];

    setCacheItems(items);
    
    // Calculate total stats
    const totalItems = items.reduce((sum, item) => sum + item.count, 0);
    const totalSizeBytes = localStorageSize + sessionStorageSize + (1.2 * 1024 * 1024) + (256 * 1024) + (2.1 * 1024 * 1024) + (180 * 1024);
    
    setCacheStats({
      totalSize: formatBytes(totalSizeBytes),
      totalItems,
      lastCleared: localStorage.getItem('lastCacheCleared') || 'Never',
      storageUsage: Math.min((totalSizeBytes / (50 * 1024 * 1024)) * 100, 100) // Assume 50MB limit
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageLastModified = (type: 'localStorage' | 'sessionStorage') => {
    const storage = type === 'localStorage' ? localStorage : sessionStorage;
    const lastModified = storage.getItem(`${type}_lastModified`);
    return lastModified ? new Date(lastModified).toLocaleDateString() : 'Unknown';
  };

  const clearCache = async (type: CacheItem['type']) => {
    setClearing(type);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate clearing time
      
      switch (type) {
        case 'localStorage':
          // Keep essential items
          const keepItems = ['access_token', 'refresh_token', 'user_preferences'];
          const toKeep: { [key: string]: string } = {};
          
          keepItems.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) toKeep[key] = value;
          });
          
          localStorage.clear();
          
          // Restore essential items
          Object.entries(toKeep).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
          
          localStorage.setItem('localStorage_lastModified', new Date().toISOString());
          setLastOperation(`🗑️ Local Storage cleared (kept essential data)`);
          break;

        case 'sessionStorage':
          sessionStorage.clear();
          sessionStorage.setItem('sessionStorage_lastModified', new Date().toISOString());
          setLastOperation(`🗑️ Session Storage completely cleared`);
          break;

        case 'indexedDB':
          // Clear IndexedDB
          if ('indexedDB' in window) {
            const databases = await indexedDB.databases();
            for (const db of databases) {
              if (db.name) {
                const deleteReq = indexedDB.deleteDatabase(db.name);
                await new Promise((resolve, reject) => {
                  deleteReq.onsuccess = () => resolve(true);
                  deleteReq.onerror = () => reject(deleteReq.error);
                });
              }
            }
          }
          setLastOperation(`🗑️ IndexedDB databases cleared`);
          break;

        case 'images':
          // Clear image cache by resetting service worker cache
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            const imageCaches = cacheNames.filter(name => name.includes('image') || name.includes('media'));
            await Promise.all(imageCaches.map(name => caches.delete(name)));
          }
          setLastOperation(`🖼️ Image cache cleared`);
          break;

        case 'styles':
          // Clear CSS cache
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            const styleCaches = cacheNames.filter(name => name.includes('css') || name.includes('style'));
            await Promise.all(styleCaches.map(name => caches.delete(name)));
          }
          setLastOperation(`🎨 CSS cache cleared`);
          break;

        case 'scripts':
          // Clear JavaScript cache
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            const scriptCaches = cacheNames.filter(name => name.includes('js') || name.includes('script'));
            await Promise.all(scriptCaches.map(name => caches.delete(name)));
          }
          setLastOperation(`⚙️ JavaScript cache cleared`);
          break;

        case 'fonts':
          // Clear font cache
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            const fontCaches = cacheNames.filter(name => name.includes('font') || name.includes('woff'));
            await Promise.all(fontCaches.map(name => caches.delete(name)));
          }
          setLastOperation(`🔤 Font cache cleared`);
          break;
      }

      // Update last cleared time
      localStorage.setItem('lastCacheCleared', new Date().toISOString());
      
      // Reload cache data
      setTimeout(() => {
        loadCacheData();
      }, 500);
      
    } catch (error) {
      console.error('Error clearing cache:', error);
      setLastOperation(`❌ Error clearing ${type} cache`);
    } finally {
      setClearing(null);
    }
  };

  const clearAllCache = async () => {
    setClearing('all');
    
    try {
      // Clear all cache types one by one
      for (const item of cacheItems) {
        await clearCache(item.type);
        await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between operations
      }
      
      setLastOperation(`🧹 All caches cleared successfully`);
      
      // Force page reload after clearing all
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error clearing all caches:', error);
      setLastOperation(`❌ Error during full cache cleanup`);
    } finally {
      setClearing(null);
    }
  };

  const exportCacheData = () => {
    const data = {
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      timestamp: new Date().toISOString(),
      stats: cacheStats
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cache-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setLastOperation(`📥 Cache data exported to file`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            🗑️ Cache Management
          </h3>
          <p className="text-gray-600">Clear cache, reset data, and manage storage</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={exportCacheData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            onClick={clearAllCache}
            disabled={clearing !== null}
            variant="destructive"
            className="flex items-center gap-2"
          >
            {clearing === 'all' ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Clear All
          </Button>
        </div>
      </div>

      {/* Cache Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Size</p>
                <p className="text-2xl font-bold text-blue-800">{cacheStats.totalSize}</p>
              </div>
              <HardDrive className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Items</p>
                <p className="text-2xl font-bold text-green-800">{cacheStats.totalItems}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Storage Usage</p>
                <p className="text-2xl font-bold text-orange-800">{cacheStats.storageUsage.toFixed(1)}%</p>
              </div>
              <Folder className="h-8 w-8 text-orange-500" />
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
              <div 
                className="h-2 rounded-full bg-orange-500"
                style={{ width: `${cacheStats.storageUsage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Last Cleared</p>
                <p className="text-sm font-semibold text-purple-800">
                  {cacheStats.lastCleared === 'Never' ? 'Never' : new Date(cacheStats.lastCleared).toLocaleDateString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cache Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cacheItems.map((item) => (
          <Card key={item.type} className={`${item.color} hover:shadow-md transition-shadow`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                <Badge variant="secondary">{item.count} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{item.description}</p>
                
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Size: {item.size}</span>
                  <span className="text-gray-500">Modified: {item.lastModified}</span>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => clearCache(item.type)}
                  disabled={clearing !== null}
                  variant={item.type === 'localStorage' ? "outline" : "destructive"}
                  className="w-full flex items-center gap-2"
                >
                  {clearing === item.type ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {item.type === 'localStorage' ? 'Clear (Keep Essential)' : 'Clear Cache'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Last Operation Status */}
      {lastOperation && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Last Operation:</strong> {lastOperation}
          </AlertDescription>
        </Alert>
      )}

      {/* Cache Management Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            💡 Cache Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">🛡️ Safe Operations:</h4>
              <ul className="space-y-1">
                <li>• Local Storage keeps essential data (auth tokens)</li>
                <li>• Export cache before major clearing</li>
                <li>• Session Storage clears on browser restart</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚠️ Important Notes:</h4>
              <ul className="space-y-1">
                <li>• "Clear All" will reload the page</li>
                <li>• You may need to re-login after clearing</li>
                <li>• Image/CSS clearing improves performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
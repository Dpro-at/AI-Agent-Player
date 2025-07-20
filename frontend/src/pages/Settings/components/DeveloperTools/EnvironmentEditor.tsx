import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { 
  Code, 
  Settings, 
  Download, 
  Upload, 
  Save, 
  RefreshCw, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Copy,
  FileText,
  Key,
  Database,
  Cloud,
  Shield
} from 'lucide-react';

interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: 'database' | 'api' | 'auth' | 'config' | 'security' | 'custom';
  isSecret: boolean;
  isEditing: boolean;
  isVisible: boolean;
  lastModified: string;
}

interface EnvTemplate {
  name: string;
  description: string;
  variables: Omit<EnvironmentVariable, 'id' | 'isEditing' | 'isVisible' | 'lastModified'>[];
}

export const EnvironmentEditor: React.FC = () => {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [saving, setSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState<boolean>(false);

  const categories = [
    { key: 'all', label: 'All Variables', icon: <Settings className="h-4 w-4" />, color: 'bg-gray-100' },
    { key: 'database', label: 'Database', icon: <Database className="h-4 w-4" />, color: 'bg-blue-100' },
    { key: 'api', label: 'API Keys', icon: <Key className="h-4 w-4" />, color: 'bg-green-100' },
    { key: 'auth', label: 'Authentication', icon: <Shield className="h-4 w-4" />, color: 'bg-purple-100' },
    { key: 'config', label: 'Configuration', icon: <Settings className="h-4 w-4" />, color: 'bg-orange-100' },
    { key: 'security', label: 'Security', icon: <Lock className="h-4 w-4" />, color: 'bg-red-100' },
    { key: 'custom', label: 'Custom', icon: <Code className="h-4 w-4" />, color: 'bg-yellow-100' }
  ];

  const templates: EnvTemplate[] = [
    {
      name: 'AI Agent Player - Development',
      description: 'Standard environment variables for AI Agent Player development',
      variables: [
        { key: 'DATABASE_URL', value: 'sqlite:///./app.db', category: 'database', isSecret: false, description: 'Database connection URL' },
        { key: 'SECRET_KEY', value: 'your-secret-key-here', category: 'security', isSecret: true, description: 'Application secret key' },
        { key: 'JWT_SECRET', value: 'your-jwt-secret-here', category: 'auth', isSecret: true, description: 'JWT token secret' },
        { key: 'OPENAI_API_KEY', value: '', category: 'api', isSecret: true, description: 'OpenAI API key for AI models' },
        { key: 'ANTHROPIC_API_KEY', value: '', category: 'api', isSecret: true, description: 'Anthropic Claude API key' },
        { key: 'GOOGLE_API_KEY', value: '', category: 'api', isSecret: true, description: 'Google Gemini API key' },
        { key: 'DEBUG', value: 'true', category: 'config', isSecret: false, description: 'Enable debug mode' },
        { key: 'LOG_LEVEL', value: 'INFO', category: 'config', isSecret: false, description: 'Application log level' },
        { key: 'CORS_ORIGINS', value: 'http://localhost:3000', category: 'config', isSecret: false, description: 'Allowed CORS origins' },
        { key: 'RATE_LIMIT_PER_MINUTE', value: '60', category: 'security', isSecret: false, description: 'API rate limit per minute' }
      ]
    },
    {
      name: 'Production Environment',
      description: 'Production-ready environment configuration',
      variables: [
        { key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost/aiagent', category: 'database', isSecret: true, description: 'Production database URL' },
        { key: 'REDIS_URL', value: 'redis://localhost:6379', category: 'database', isSecret: false, description: 'Redis cache URL' },
        { key: 'SECRET_KEY', value: '', category: 'security', isSecret: true, description: 'Strong production secret key' },
        { key: 'DEBUG', value: 'false', category: 'config', isSecret: false, description: 'Disable debug in production' },
        { key: 'HTTPS_ONLY', value: 'true', category: 'security', isSecret: false, description: 'Force HTTPS connections' },
        { key: 'SECURE_COOKIES', value: 'true', category: 'security', isSecret: false, description: 'Use secure cookies' }
      ]
    }
  ];

  useEffect(() => {
    loadEnvironmentVariables();
  }, []);

  const loadEnvironmentVariables = () => {
    // Load existing environment variables from localStorage
    const stored = localStorage.getItem('environmentVariables');
    if (stored) {
      setVariables(JSON.parse(stored));
    } else {
      // Initialize with some default variables
      const defaultVars: EnvironmentVariable[] = [
        {
          id: '1',
          key: 'DATABASE_URL',
          value: 'sqlite:///./app.db',
          category: 'database',
          isSecret: false,
          isEditing: false,
          isVisible: true,
          description: 'Database connection URL',
          lastModified: new Date().toISOString()
        },
        {
          id: '2',
          key: 'SECRET_KEY',
          value: 'your-secret-key-here',
          category: 'security',
          isSecret: true,
          isEditing: false,
          isVisible: false,
          description: 'Application secret key',
          lastModified: new Date().toISOString()
        },
        {
          id: '3',
          key: 'DEBUG',
          value: 'true',
          category: 'config',
          isSecret: false,
          isEditing: false,
          isVisible: true,
          description: 'Enable debug mode',
          lastModified: new Date().toISOString()
        }
      ];
      setVariables(defaultVars);
      saveToStorage(defaultVars);
    }

    const lastSavedTime = localStorage.getItem('envLastSaved');
    if (lastSavedTime) {
      setLastSaved(new Date(lastSavedTime).toLocaleString());
    }
  };

  const saveToStorage = (vars: EnvironmentVariable[]) => {
    localStorage.setItem('environmentVariables', JSON.stringify(vars));
    localStorage.setItem('envLastSaved', new Date().toISOString());
    setLastSaved(new Date().toLocaleString());
  };

  const addVariable = () => {
    const newVar: EnvironmentVariable = {
      id: Date.now().toString(),
      key: '',
      value: '',
      category: 'custom',
      isSecret: false,
      isEditing: true,
      isVisible: true,
      lastModified: new Date().toISOString()
    };
    
    setVariables(prev => [newVar, ...prev]);
  };

  const updateVariable = (id: string, updates: Partial<EnvironmentVariable>) => {
    setVariables(prev => prev.map(variable => 
      variable.id === id 
        ? { ...variable, ...updates, lastModified: new Date().toISOString() }
        : variable
    ));
  };

  const deleteVariable = (id: string) => {
    setVariables(prev => {
      const updated = prev.filter(variable => variable.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const toggleVisibility = (id: string) => {
    updateVariable(id, { 
      isVisible: !variables.find(v => v.id === id)?.isVisible 
    });
  };

  const toggleSecret = (id: string) => {
    const variable = variables.find(v => v.id === id);
    updateVariable(id, { 
      isSecret: !variable?.isSecret,
      isVisible: variable?.isSecret ? true : false // Show non-secret values by default
    });
  };

  const saveVariable = (id: string) => {
    updateVariable(id, { isEditing: false });
    const updated = variables.map(v => v.id === id ? { ...v, isEditing: false } : v);
    saveToStorage(updated);
  };

  const saveAllVariables = async () => {
    setSaving(true);
    
    try {
      // Simulate API call to save environment variables
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updated = variables.map(v => ({ ...v, isEditing: false }));
      setVariables(updated);
      saveToStorage(updated);
      
      // Generate .env file content
      generateEnvFile();
      
    } catch (error) {
      console.error('Error saving environment variables:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateEnvFile = () => {
    const envContent = variables
      .filter(v => v.key.trim() !== '')
      .map(variable => {
        const comment = variable.description ? `# ${variable.description}\n` : '';
        return `${comment}${variable.key}=${variable.value}`;
      })
      .join('\n\n');

    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (template: EnvTemplate) => {
    const templateVars: EnvironmentVariable[] = template.variables.map((variable, index) => ({
      ...variable,
      id: (Date.now() + index).toString(),
      isEditing: false,
      isVisible: !variable.isSecret,
      lastModified: new Date().toISOString()
    }));
    
    setVariables(templateVars);
    saveToStorage(templateVars);
    setShowTemplates(false);
  };

  const copyVariable = (variable: EnvironmentVariable) => {
    navigator.clipboard.writeText(`${variable.key}=${variable.value}`);
  };

  const filteredVariables = variables.filter(variable => {
    const matchesSearch = variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variable.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variable.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || variable.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: EnvironmentVariable['category']) => {
    const cat = categories.find(c => c.key === category);
    return cat?.icon || <Settings className="h-4 w-4" />;
  };

  const getCategoryColor = (category: EnvironmentVariable['category']) => {
    const cat = categories.find(c => c.key === category);
    return cat?.color || 'bg-gray-100';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Code className="h-5 w-5" />
            ⚙️ Environment Editor (.env)
          </h3>
          <p className="text-gray-600">Edit environment variables and configuration</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowTemplates(!showTemplates)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Templates
          </Button>
          <Button 
            onClick={generateEnvFile}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download .env
          </Button>
          <Button 
            onClick={saveAllVariables}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save All
          </Button>
        </div>
      </div>

      {/* Save Status */}
      {lastSaved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Last saved:</strong> {lastSaved}
          </AlertDescription>
        </Alert>
      )}

      {/* Templates Panel */}
      {showTemplates && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Environment Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template, index) => (
                <Card key={index} className="bg-white hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => loadTemplate(template)}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">{template.variables.length} variables</Badge>
                      <Button size="sm">Load Template</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Environment Variables</span>
            <Button onClick={addVariable} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Variable
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex gap-2 flex-wrap">
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
                  {category.key !== 'all' && (
                    <Badge variant="secondary" className="ml-1">
                      {variables.filter(v => v.category === category.key).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            
            <input
              type="text"
              placeholder="Search variables..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Variables List */}
          <div className="space-y-3">
            {filteredVariables.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No environment variables found</p>
                <Button onClick={addVariable} className="mt-2">
                  Add your first variable
                </Button>
              </div>
            ) : (
              filteredVariables.map((variable) => (
                <Card key={variable.id} className={`${getCategoryColor(variable.category)} border`}>
                  <CardContent className="p-4">
                    {variable.isEditing ? (
                      /* Edit Mode */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Variable name"
                            className="px-3 py-2 border border-gray-300 rounded-md font-mono"
                            value={variable.key}
                            onChange={(e) => updateVariable(variable.id, { key: e.target.value })}
                          />
                          <input
                            type={variable.isSecret && !variable.isVisible ? "password" : "text"}
                            placeholder="Variable value"
                            className="px-3 py-2 border border-gray-300 rounded-md font-mono"
                            value={variable.value}
                            onChange={(e) => updateVariable(variable.id, { value: e.target.value })}
                          />
                          <select
                            className="px-3 py-2 border border-gray-300 rounded-md"
                            value={variable.category}
                            onChange={(e) => updateVariable(variable.id, { category: e.target.value as any })}
                          >
                            {categories.slice(1).map(cat => (
                              <option key={cat.key} value={cat.key}>{cat.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={variable.description || ''}
                          onChange={(e) => updateVariable(variable.id, { description: e.target.value })}
                        />
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={variable.isSecret ? "default" : "outline"}
                              onClick={() => toggleSecret(variable.id)}
                              className="flex items-center gap-1"
                            >
                              {variable.isSecret ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                              {variable.isSecret ? 'Secret' : 'Public'}
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveVariable(variable.id)}
                              disabled={!variable.key.trim()}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteVariable(variable.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(variable.category)}
                            <div>
                              <code className="text-sm font-bold text-gray-900">{variable.key}</code>
                              {variable.description && (
                                <p className="text-xs text-gray-600 mt-1">{variable.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {variable.isSecret && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                Secret
                              </Badge>
                            )}
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getCategoryIcon(variable.category)}
                              {categories.find(c => c.key === variable.category)?.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <code className="text-sm font-mono flex-1">
                            {variable.isSecret && !variable.isVisible ? 
                              '•'.repeat(Math.min(variable.value.length, 20)) : 
                              variable.value || <span className="text-gray-400">No value set</span>
                            }
                          </code>
                          
                          <div className="flex gap-1 ml-3">
                            {variable.isSecret && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleVisibility(variable.id)}
                              >
                                {variable.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyVariable(variable)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateVariable(variable.id, { isEditing: true })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteVariable(variable.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Last modified: {new Date(variable.lastModified).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Environment Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            💡 Environment Variable Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">🔐 Security Best Practices:</h4>
              <ul className="space-y-1">
                <li>• Mark sensitive data as "Secret"</li>
                <li>• Never commit .env files to version control</li>
                <li>• Use strong, unique keys for production</li>
                <li>• Regularly rotate API keys and secrets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚙️ Configuration Tips:</h4>
              <ul className="space-y-1">
                <li>• Use descriptive variable names</li>
                <li>• Group related variables by category</li>
                <li>• Provide clear descriptions for complex values</li>
                <li>• Use templates for consistent setups</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
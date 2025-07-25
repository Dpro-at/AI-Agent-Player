import React, { useState, useEffect } from 'react';
import { agentsService } from '../../../services/agents';
import EndpointSuggestions from '../../../components/EndpointSuggestions';

interface LocalEndpoint {
  id: string;
  name: string;
  host: string;
  port: string;
  endpoint: string;
  model: string;
  isActive: boolean;
}

interface LLMConfig {
  provider: string;
  model: string;
  deployment: 'online' | 'local';
  apiKey: string;
  localConfig: {
    host: string;
    port: string;
    endpoint: string;
  };
  localEndpoints: LocalEndpoint[];
}

interface AgentSettings {
  autoResponse: boolean;
  learning: boolean;
  maxConcurrency: number;
  temperature: number;
  maxTokens: number;
}

interface AgentFormData {
  name: string;
  description: string;
  type: string;
  capabilities: string[];
  llmConfig: LLMConfig;
  settings: AgentSettings;
}

interface AgentData {
  id: number;
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  type?: string;
  tasks?: number;
  performance?: string;
  llmProvider?: string;
  llmModel?: string;
  connectedLLMs?: string[];
  parentAgent?: string;
  apiKey?: string;
  temperature?: string;
  maxTokens?: number;
  capabilities?: string[];
}

interface MainAgentOption {
  id: number;
  name: string;
  description: string;
  model_provider: string;
  status: string;
}

interface ProviderConfig {
  name: string;
  description: string;
  difficulty: string;
  cost: string;
  models: Array<{ value: string; label: string; desc: string }>;
  requiresApiKey?: boolean;
  isLocal?: boolean;
  category?: 'cloud' | 'local';
}

interface AgentBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentData: AgentFormData) => void;
  agentType: 'main' | 'child';
  initialData?: AgentData; // Initial data for editing
  isEditing?: boolean; // Whether in editing mode
}

export const AgentBuilder: React.FC<AgentBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  agentType,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    type: agentType === 'child' ? 'trainer' : 'simple',
    capabilities: [] as string[],
    llmConfig: {
      provider: 'openai',
      model: 'gpt-4',
      deployment: 'online',
      apiKey: '',
      localConfig: {
        host: 'localhost',
        port: '8080',
        endpoint: '/v1/chat/completions',
      },
      localEndpoints: [],
    },
    settings: {
      autoResponse: true,
      learning: true,
      maxConcurrency: 10,
      temperature: 0.7,
      maxTokens: 2048,
    },
  });


  const [showApiKey, setShowApiKey] = useState(false);
  const [mainAgents, setMainAgents] = useState<MainAgentOption[]>([]);
  const [selectedParentAgent, setSelectedParentAgent] = useState<number | null>(null);

  // Load main agents for child agent parent selection
  useEffect(() => {
    if (agentType === 'child' && isOpen) {
      const loadMainAgents = async () => {
        try {
          const agents = await agentsService.getMainAgents();
          console.log('✅ Main agents loaded:', agents);
          
          if (agents && agents.length > 0) {
            const agentsArray = agents.map(agent => ({
              id: agent.id,
              name: agent.name,
              description: agent.description || '',
              model_provider: 'openai', // Default value since Agent type doesn't have this property
              status: agent.is_active ? 'active' : 'inactive'
            }));
            setMainAgents(agentsArray);
          } else {
            console.warn('⚠️ No main agents found');
            setMainAgents([]);
          }
        } catch (error) {
          console.error('❌ Error loading main agents:', error);
          setMainAgents([]);
        }
      };
      loadMainAgents();
    }
  }, [agentType, isOpen]);

  // Load initial data when editing - ENHANCED VERSION
  React.useEffect(() => {
    if (isEditing && initialData) {
      console.log('🔧 Loading initial data for editing:', initialData);
      console.log('🔧 Initial data received:', JSON.stringify(initialData, null, 2));
      
      // Show API key if exists when editing
      if (initialData.apiKey) {
        console.log('🔑 API Key found in agent data - setting up visibility controls');
        setShowApiKey(false); // Start hidden but can be shown with eye button
      }
      
      // ✅ NEW: Determine deployment type from backend data
      let deployment: 'online' | 'local' = 'online';
      let localConfig = {
        host: 'localhost',
        port: '8080',
        endpoint: '/v1/chat/completions',
      };
      
      // Check for local deployment indicators in saved data
      const agentData = initialData as any; // Type assertion for extended data
      
      if (agentData.llmConfig && agentData.llmConfig.deployment === 'local') {
        // From enhanced agent data with llmConfig
        deployment = 'local';
        localConfig = agentData.llmConfig.localConfig || localConfig;
        console.log('✅ Found local deployment in llmConfig:', agentData.llmConfig);
      } else if (agentData.api_endpoint && agentData.api_endpoint.includes('localhost')) {
        // From api_endpoint field
        deployment = 'local';
        try {
          const url = new URL(agentData.api_endpoint);
          localConfig = {
            host: url.hostname,
            port: url.port || (url.hostname === 'localhost' ? '11434' : '8080'), // Default to Ollama port for localhost
            endpoint: url.pathname,
          };
          console.log('✅ Detected local deployment from api_endpoint:', agentData.api_endpoint);
          console.log('✅ Parsed localConfig:', localConfig);
          
          // ✅ NEW: Also update the model provider if it's local
          if (url.port === '11434' || agentData.model_provider === 'ollama') {
            console.log('🦙 Setting provider to ollama based on port 11434');
            // Ensure we use the correct endpoint for Ollama
            if (localConfig && !localConfig.endpoint.startsWith('/v1/')) {
              localConfig.endpoint = '/v1/chat/completions';
              console.log('🔧 Updated Ollama endpoint to:', localConfig.endpoint);
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not parse api_endpoint:', agentData.api_endpoint, error);
        }
      } else if (agentData.local_config) {
        // From local_config field
        deployment = 'local';
        localConfig = agentData.local_config;
        console.log('✅ Found local deployment in local_config:', agentData.local_config);
      } else if (agentData.is_local_model) {
        // From is_local_model flag
        deployment = 'local';
        console.log('✅ Found local deployment flag is_local_model:', agentData.is_local_model);
      }
      
      console.log('🎯 Final deployment type:', deployment);
      console.log('🎯 Final localConfig:', localConfig);
      
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        type: agentType === 'child' ? 'trainer' : 'simple',
        capabilities: initialData.capabilities || [], // Use saved capabilities
        llmConfig: {
          provider: initialData.llmProvider || 'openai',
          model: initialData.llmModel || 'gpt-4',
          deployment: deployment, // ✅ NOW USES DETECTED DEPLOYMENT TYPE
          apiKey: initialData.apiKey || '', // Show saved API key
          localConfig: localConfig, // ✅ NOW USES DETECTED LOCAL CONFIG
          localEndpoints: [],
        },
        settings: {
          autoResponse: true,
          learning: true,
          maxConcurrency: 10,
          temperature: parseFloat(initialData.temperature || '0.7'), // Use saved value
          maxTokens: initialData.maxTokens || 2048, // Use saved value
        },
      });
    } else if (!isEditing) {
      // Reset model for new creation
      setFormData({
        name: '',
        description: '',
        type: agentType === 'child' ? 'trainer' : 'simple',
        capabilities: [],
        llmConfig: {
          provider: 'openai',
          model: 'gpt-4',
          deployment: 'online',
          apiKey: '',
          localConfig: {
            host: 'localhost',
            port: '8080',
            endpoint: '/v1/chat/completions',
          },
          localEndpoints: [],
        },
        settings: {
          autoResponse: true,
          learning: true,
          maxConcurrency: 10,
          temperature: 0.7,
          maxTokens: 2048,
        },
      });
    }
  }, [isEditing, initialData, agentType]);

  const llmProviders = {
    // Most Popular Options
    openai: {
      name: '🤖 OpenAI (Most Popular)',
      difficulty: 'Easy',
      cost: 'Paid',
      requiresApiKey: true,
      isLocal: false,
      category: 'paid',
      description: 'Most popular and user-friendly AI service. Best for beginners!',
      models: [
        { value: 'gpt-3.5-turbo', label: '🟢 GPT-3.5 Turbo (Recommended)', desc: 'Perfect for beginners - Fast and affordable' },
        { value: 'gpt-4', label: '🟡 GPT-4', desc: 'More powerful but costs more' },
        { value: 'gpt-4o', label: '🔴 GPT-4o (Latest)', desc: 'Most advanced - multimodal' },
        { value: 'gpt-4-turbo', label: '🟡 GPT-4 Turbo', desc: 'Fast GPT-4 variant' },
      ],
    },
    google: {
      name: '🔍 Google Gemini',
      difficulty: 'Easy',
      cost: 'Paid',
      requiresApiKey: true,
      isLocal: false,
      category: 'paid',
      description: 'Google\'s powerful AI with strong multimodal capabilities.',
      models: [
        { value: 'gemini-1.5-flash', label: '🟢 Gemini 1.5 Flash', desc: 'Fast and efficient' },
        { value: 'gemini-1.5-pro', label: '🟡 Gemini 1.5 Pro', desc: 'Advanced reasoning capabilities' },
        { value: 'gemini-1.0-pro', label: '🟡 Gemini 1.0 Pro', desc: 'Multimodal capabilities' },
        { value: 'gemini-ultra', label: '🔴 Gemini Ultra', desc: 'Most capable Gemini model' },
      ],
    },
    ollama: {
      name: '🦙 Ollama (Local)',
      difficulty: 'Easy',
      cost: 'Free',
      requiresApiKey: false,
      isLocal: true,
      category: 'free',
      description: '✅ FREE! Run AI models locally on your computer. Complete privacy and control.',
      models: [
        // ✅ VISION MODELS - Multimodal (Text + Images)
        { value: 'qwen2.5vl:7b', label: '🔥 Qwen2.5-VL 7B (Vision + Text)', desc: 'Excellent vision model - Can see and understand images!' },
        { value: 'llava:latest', label: '🟡 LLaVA (Vision)', desc: 'Popular vision model - Chat about images' },
        { value: 'llava:7b', label: '🟢 LLaVA 7B', desc: 'Smaller vision model for faster responses' },
        { value: 'llava:13b', label: '🔴 LLaVA 13B', desc: 'More capable vision understanding' },
        
        // ✅ POPULAR CHAT MODELS - Best for conversations
        { value: 'llama3.2:latest', label: '🟢 Llama 3.2 (Recommended)', desc: 'Latest Meta model - Great for chat and reasoning' },
        { value: 'llama3.1:latest', label: '🟢 Llama 3.1', desc: 'Very capable - Good balance of speed and quality' },
        { value: 'llama3:latest', label: '🟢 Llama 3', desc: 'Stable and reliable for general use' },
        { value: 'qwen2.5:latest', label: '🟡 Qwen2.5 (Multilingual)', desc: 'Excellent for multiple languages including Arabic' },
        { value: 'qwen2:latest', label: '🟡 Qwen2', desc: 'Strong reasoning and multilingual support' },
        
        // ✅ CODING SPECIALISTS - Best for programming
        { value: 'codellama:latest', label: '🟡 Code Llama (Programming)', desc: 'Meta model specialized for code generation' },
        { value: 'deepseek-coder:latest', label: '🟡 DeepSeek Coder', desc: 'Excellent at understanding and writing code' },
        { value: 'codeqwen:latest', label: '🟡 CodeQwen', desc: 'Alibaba coding model with strong performance' },
        
        // ✅ EFFICIENT MODELS - Best for speed
        { value: 'phi3:latest', label: '🟢 Phi-3 (Fast)', desc: 'Microsoft model - Small but very capable' },
        { value: 'gemma2:latest', label: '🟢 Gemma 2', desc: 'Google model - Good performance, efficient' },
        { value: 'mistral:latest', label: '🟢 Mistral 7B', desc: 'French model - Fast and multilingual' },
        { value: 'tinyllama:latest', label: '🟢 TinyLlama (Ultra Fast)', desc: 'Very small model for quick responses' },
        
        // ✅ ADVANCED MODELS - Best quality (needs more RAM)
        { value: 'llama3.1:70b', label: '🔴 Llama 3.1 70B (Premium)', desc: 'Largest model - Requires 64GB+ RAM' },
        { value: 'mixtral:8x7b', label: '🔴 Mixtral 8x7B (Advanced)', desc: 'Mixture of experts - Very intelligent' },
        { value: 'qwen2.5:32b', label: '🔴 Qwen2.5 32B', desc: 'Large multilingual model - Excellent quality' },
        
        // ✅ CUSTOM/SPECIALIZED
        { value: 'custom-model', label: '⚙️ Custom Model', desc: 'Enter your own model name manually' },
      ],
    },
  };



  const capabilities = [
    '💬 Natural Language Processing',
    '🔍 Data Analysis',
    '📝 Content Generation',
    '🔄 Workflow Automation',
    '📊 Reporting',
    '🔒 Security Monitoring',
    '🌐 API Integration',
    '📱 Multi-channel Support',
    '🧠 Machine Learning',
    '🎨 Creative Writing',
    '📚 Research & Summarization',
    '🔧 Code Generation',
    '📧 Email Management',
    '📅 Calendar & Scheduling',
    '💰 Financial Analysis',
    '🏥 Healthcare Support',
  ];

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      boxSizing: 'border-box' as const,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '900px',
      maxHeight: 'calc(100vh - 40px)',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    header: {
      padding: '24px 24px 20px 24px',
      borderBottom: '1px solid #e9ecef',
      marginBottom: '0',
      flexShrink: 0,
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6c757d',
      marginBottom: '16px',
    },
    content: {
      padding: '24px',
      flex: 1,
      overflow: 'auto',
    },
    section: {
      marginBottom: '40px',
      padding: '0',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#495057',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      paddingBottom: '8px',
      borderBottom: '2px solid #f8f9fa',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s ease',
      marginBottom: '16px',
      boxSizing: 'border-box' as const,
      fontFamily: 'inherit',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
      marginBottom: '16px',
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
    },
    providerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '16px',
    },
    providerCard: {
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center' as const,
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    providerCardSelected: {
      borderColor: '#667eea',
      backgroundColor: '#f8f9ff',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
      transform: 'translateY(-2px)',
    },
    modelSelect: {
      width: '100%',
      padding: '10px 12px',
      border: '2px solid #e9ecef',
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '12px',
    },
    deploymentTabs: {
      display: 'flex',
      marginBottom: '16px',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid #e9ecef',
    },
    deploymentTab: {
      flex: 1,
      padding: '16px 20px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      backgroundColor: '#f8f9fa',
      color: '#6c757d',
      textAlign: 'center' as const,
    },
    deploymentTabActive: {
      backgroundColor: '#667eea',
      color: 'white',
    },
    configSection: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '12px',
      marginTop: '16px',
      border: '1px solid #e9ecef',
    },
    configTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#495057',
    },
    typeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
    },
    typeCard: {
      padding: '20px',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center' as const,
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    typeCardSelected: {
      borderColor: '#667eea',
      backgroundColor: '#f8f9ff',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
      transform: 'translateY(-2px)',
    },
    typeLabel: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '4px',
    },
    typeDesc: {
      fontSize: '12px',
      color: '#6c757d',
    },
    capabilitiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '12px',
    },
    capabilityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '13px',
      border: '1px solid transparent',
      backgroundColor: '#f8f9fa',
    },
    capabilitySelected: {
      backgroundColor: '#e3f2fd',
      borderColor: '#667eea',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
    },
    checkbox: {
      width: '16px',
      height: '16px',
    },
    settingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
    },
    settingItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      fontSize: '14px',
      fontWeight: '500',
    },
    switch: {
      position: 'relative' as const,
      width: '44px',
      height: '24px',
      backgroundColor: '#ccc',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    switchActive: {
      backgroundColor: '#667eea',
    },
    switchThumb: {
      position: 'absolute' as const,
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'transform 0.2s ease',
    },
    switchThumbActive: {
      transform: 'translateX(20px)',
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    range: {
      flex: 1,
      height: '6px',
      borderRadius: '3px',
      outline: 'none',
      cursor: 'pointer',
    },
    rangeValue: {
      minWidth: '40px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#495057',
    },
    actions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '32px',
      paddingTop: '20px',
      borderTop: '1px solid #e9ecef',
      flexShrink: 0,
      backgroundColor: 'white',
      position: 'sticky' as const,
      bottom: 0,
      marginLeft: '-24px',
      marginRight: '-24px',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
    button: {
      padding: '14px 28px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    primaryButton: {
      backgroundColor: '#667eea',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    secondaryButton: {
      backgroundColor: '#f8f9fa',
      color: '#495057',
      border: '1px solid #e9ecef',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For child agents, validate parent selection
    if (agentType === 'child' && !selectedParentAgent) {
      alert('Please select a parent agent for this child agent.');
      return;
    }
    
    // Add parent_agent_id to formData for child agents
    const submitData = {
      ...formData,
      ...(agentType === 'child' && { parent_agent_id: selectedParentAgent })
    };
    
    onSave(submitData);
    onClose();
  };

  // Handle behavioral settings toggle
  const toggleBehavioralSetting = (setting: keyof AgentSettings) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting]
      }
    }));
  };

  // Handle capability toggle
  const toggleCapability = (capability: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(capability)
        ? prev.capabilities.filter(c => c !== capability)
        : [...prev.capabilities, capability]
    }));
  };

  const updateLLMConfig = (field: string, value: string) => {
    setFormData(prev => {
      const newLLMConfig = {
        ...prev.llmConfig,
        [field]: value,
      };
      
      // ✅ Auto-update model when provider changes
      if (field === 'provider') {
        const provider = llmProviders[value as keyof typeof llmProviders];
        if (provider && provider.models.length > 0) {
          // Set the first model as default for this provider
          newLLMConfig.model = provider.models[0].value;
          console.log(`🔄 Provider changed to '${value}', auto-selected model: '${provider.models[0].value}'`);
        }
      }
      
      return {
        ...prev,
        llmConfig: newLLMConfig,
      };
    });
  };

  const updateLocalConfig = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      llmConfig: {
        ...prev.llmConfig,
        localConfig: {
          ...prev.llmConfig.localConfig,
          [field]: value,
        },
      },
    }));
  };

  const addLocalEndpoint = () => {
    const newEndpoint: LocalEndpoint = {
      id: Date.now().toString(),
      name: `Endpoint ${formData.llmConfig.localEndpoints.length + 1}`,
      host: 'localhost',
      port: '8080',
      endpoint: '/v1/chat/completions',
      model: 'llama2',
      isActive: true,
    };

    setFormData(prev => ({
      ...prev,
      llmConfig: {
        ...prev.llmConfig,
        localEndpoints: [...prev.llmConfig.localEndpoints, newEndpoint],
      },
    }));
  };

  const removeLocalEndpoint = (id: string) => {
    setFormData(prev => ({
      ...prev,
      llmConfig: {
        ...prev.llmConfig,
        localEndpoints: prev.llmConfig.localEndpoints.filter(ep => ep.id !== id),
      },
    }));
  };

  const updateLocalEndpoint = (id: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      llmConfig: {
        ...prev.llmConfig,
        localEndpoints: prev.llmConfig.localEndpoints.map(ep =>
          ep.id === id ? { ...ep, [field]: value } : ep
        ),
      },
    }));
  };

  if (!isOpen) return null;

  const currentProvider = llmProviders[formData.llmConfig.provider as keyof typeof llmProviders] as ProviderConfig;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {agentType === 'main' ? '🚀' : '🤖'}
            {isEditing ? 'Edit' : 'Create'} {agentType === 'main' ? 'Main' : 'Child'} Agent
          </h2>
          <p style={styles.subtitle}>
            {isEditing
              ? `Update the configuration and settings for your ${agentType} agent`
              : agentType === 'main' 
                ? 'Choose your AI service and connect it in just a few simple steps!'
                : 'Create a specialized assistant that learns specific tasks and workflows'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.content}>
          {/* Basic Information */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              📝 Basic Information
            </h3>
            {/* Agent Name */}
                          <input
                style={styles.input}
                type="text"
                placeholder="Agent Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />


            <textarea
              style={styles.textarea}
              placeholder="Agent Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* LLM Configuration - Only for Main Agents */}
          {agentType === 'main' && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                🧠 Choose Your AI Brain (LLM)
              </h3>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#e8f4fd', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid #bee5eb'
              }}>
                <div style={{ fontSize: '13px', color: '#0c5460', lineHeight: '1.5' }}>
                  💡 <strong>What's this?</strong> Choose which AI service will power your assistant. 
                  Think of it like choosing a brain for your AI - each has different strengths!
                </div>
              </div>
              
              {/* Provider Selection */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#495057' }}>
                  👇 Choose your AI provider:
                </div>
                


                <div style={styles.providerGrid}>
                  {Object.entries(llmProviders)
                    .map(([key, provider]) => (
                    <div
                      key={key}
                      style={{
                        ...styles.providerCard,
                        ...(formData.llmConfig.provider === key ? styles.providerCardSelected : {}),
                        padding: '16px',
                        textAlign: 'left' as const,
                      }}
                      onClick={() => updateLLMConfig('provider', key)}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                        {provider.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '8px' }}>
                        {provider.description}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '10px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          backgroundColor: provider.difficulty === 'Easy' ? '#d4edda' : provider.difficulty === 'Medium' ? '#fff3cd' : '#f8d7da', 
                          color: provider.difficulty === 'Easy' ? '#155724' : provider.difficulty === 'Medium' ? '#856404' : '#721c24',
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}>
                          {provider.difficulty}
                        </span>
                        <span style={{ 
                          backgroundColor: provider.cost === 'Free' || provider.cost === 'Free/Paid' ? '#d4edda' : '#f8d7da', 
                          color: provider.cost === 'Free' || provider.cost === 'Free/Paid' ? '#155724' : '#721c24',
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}>
                          {provider.cost}
                        </span>
                        {/* ✅ NEW: API Key Requirement Indicator */}
                        <span style={{ 
                          backgroundColor: (provider as ProviderConfig).requiresApiKey ? '#fff3cd' : '#d4edda', 
                          color: (provider as ProviderConfig).requiresApiKey ? '#856404' : '#155724',
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontWeight: '600'
                        }}>
                          {(provider as ProviderConfig).requiresApiKey ? '🔑 API Key' : '✅ No Key'}
                        </span>
                        {/* ✅ NEW: Local Indicator */}
                        {(provider as ProviderConfig).isLocal && (
                          <span style={{ 
                            backgroundColor: '#e8f4fd', 
                            color: '#0c5460',
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: '600'
                          }}>
                            🏠 Local
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <select
                style={styles.modelSelect}
                value={formData.llmConfig.model}
                onChange={(e) => updateLLMConfig('model', e.target.value)}
              >
                {currentProvider?.models.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label} - {model.desc}
                  </option>
                ))}
              </select>

              {/* Custom Model Input - Show when "custom-model" is selected */}
              {formData.llmConfig.model === 'custom-model' && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '16px', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '8px',
                  border: '1px solid #ffeaa7'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#856404' }}>
                    ⚙️ Enter Custom Model Name
                  </div>
                  <div style={{ fontSize: '12px', color: '#856404', marginBottom: '12px' }}>
                    💡 Enter the exact model name as it appears in your local AI server (e.g., "qwen2.5vl:7b", "llama3.2:latest")
                  </div>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g., qwen2.5vl:7b, llama3.2:latest, custom-fine-tuned-model"
                    value={formData.llmConfig.model === 'custom-model' ? '' : formData.llmConfig.model}
                    onChange={(e) => updateLLMConfig('model', e.target.value)}
                    autoFocus
                  />
                  <div style={{ fontSize: '11px', color: '#856404', marginTop: '8px' }}>
                    ✅ This will be used exactly as entered - make sure it matches your model name!
                  </div>
                </div>
              )}

              {/* Deployment Type */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
                  📡 How will you connect to the AI?
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '12px' }}>
                  💡 Most beginners should choose "Online/Cloud" - it's easier!
                </div>
                <div style={styles.deploymentTabs}>
                  <button
                    type="button"
                    style={{
                      ...styles.deploymentTab,
                      ...(formData.llmConfig.deployment === 'online' ? styles.deploymentTabActive : {}),
                    }}
                    onClick={() => updateLLMConfig('deployment', 'online')}
                  >
                    <div>🌐 Online/Cloud</div>
                    <div style={{ fontSize: '10px', marginTop: '4px' }}>Recommended for beginners</div>
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.deploymentTab,
                      ...(formData.llmConfig.deployment === 'local' ? styles.deploymentTabActive : {}),
                    }}
                    onClick={() => updateLLMConfig('deployment', 'local')}
                  >
                    <div>💻 Local/Self-hosted</div>
                    <div style={{ fontSize: '10px', marginTop: '4px' }}>For advanced users</div>
                  </button>
                </div>
              </div>

              {/* Configuration based on deployment type */}
              {formData.llmConfig.deployment === 'online' ? (
                <div style={styles.configSection}>
                  <div style={styles.configTitle}>🔑 Connect to {currentProvider?.name}</div>
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#fff3cd', 
                    borderRadius: '6px', 
                    marginBottom: '12px',
                    border: '1px solid #ffeaa7'
                  }}>
                    <div style={{ fontSize: '12px', color: '#856404', lineHeight: '1.5' }}>
                      <strong>📋 How to get your API Key:</strong><br/>
                      {currentProvider?.requiresApiKey ? (
                        <>
                          {formData.llmConfig.provider === 'openai' && '1. Go to platform.openai.com → 2. Sign up/Login → 3. Create API Key'}
                          {formData.llmConfig.provider === 'anthropic' && '1. Go to console.anthropic.com → 2. Sign up/Login → 3. Create API Key'}
                          {formData.llmConfig.provider === 'google' && '1. Go to console.cloud.google.com → 2. Enable AI API → 3. Create API Key'}
                          {!['openai', 'anthropic', 'google'].includes(formData.llmConfig.provider) && 'Check the provider\'s website for API key instructions'}
                        </>
                      ) : (
                        '✅ No API Key needed! This provider runs locally on your computer.'
                      )}
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={styles.input}
                      type={showApiKey ? 'text' : 'password'}
                      placeholder={
                        !currentProvider?.requiresApiKey 
                          ? '✅ No API Key needed for this provider!' 
                          : 'Paste your API Key here (starts with sk-...)'
                      }
                      value={formData.llmConfig.apiKey}
                      onChange={(e) => updateLLMConfig('apiKey', e.target.value)}
                      disabled={!currentProvider?.requiresApiKey}
                    />
                    {formData.llmConfig.apiKey && currentProvider?.requiresApiKey && (
                      <button
                        type="button"
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: '#6c757d',
                          padding: '4px',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setShowApiKey(!showApiKey)}
                        title={showApiKey ? 'Hide API Key' : 'Show API Key'}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.color = '#495057';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#6c757d';
                        }}
                      >
                        {showApiKey ? '🙈' : '👁️'}
                      </button>
                    )}
                  </div>
                  {currentProvider?.requiresApiKey ? (
                    formData.llmConfig.apiKey && (
                      <div style={{ fontSize: '11px', color: '#28a745', marginTop: '4px' }}>
                        ✅ API Key entered! Your AI is ready to connect.
                        {isEditing && (
                          <span style={{ color: '#667eea', marginLeft: '8px' }}>
                            (Current key loaded - click 👁️ to view)
                          </span>
                        )}
                      </div>
                    )
                  ) : (
                    <div style={{ fontSize: '11px', color: '#28a745', marginTop: '4px' }}>
                      ✅ No API Key needed! This provider runs locally on your computer.
                    </div>
                  )}

                  {/* ✅ NEW: Cloud Endpoint Suggestions for Online Mode */}
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: '#495057' }}>
                      🌐 {currentProvider?.category === 'cloud' ? 'Cloud API' : 'Local Server'} Endpoint Configuration
                    </div>
                    <EndpointSuggestions
                      selectedModel={formData.llmConfig.model}
                      selectedProvider={formData.llmConfig.provider}
                      currentHost={formData.llmConfig.localConfig.host}
                      currentPort={formData.llmConfig.localConfig.port}
                      currentEndpoint={formData.llmConfig.localConfig.endpoint}
                      onEndpointSelect={(host, port, endpoint) => {
                        updateLocalConfig('host', host);
                        updateLocalConfig('port', port);
                        updateLocalConfig('endpoint', endpoint);
                      }}
                      onConfigChange={(config) => {
                        console.log('📋 Endpoint config selected:', config);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={styles.configSection}>
                  <div style={styles.configTitle}>🏠 Local Configuration</div>
                  
                  {/* Default/Main Endpoint */}
                  <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: '#495057' }}>
                      🎯 Primary Endpoint
                    </div>
                    <div style={styles.twoColumn}>
                      <input
                        style={styles.input}
                        type="text"
                        placeholder="Host (e.g., localhost)"
                        value={formData.llmConfig.localConfig.host}
                        onChange={(e) => updateLocalConfig('host', e.target.value)}
                      />
                      <input
                        style={styles.input}
                        type="text"
                        placeholder="Port (e.g., 8080)"
                        value={formData.llmConfig.localConfig.port}
                        onChange={(e) => updateLocalConfig('port', e.target.value)}
                      />
                    </div>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="API Endpoint (e.g., /v1/chat/completions)"
                      value={formData.llmConfig.localConfig.endpoint}
                      onChange={(e) => updateLocalConfig('endpoint', e.target.value)}
                    />
                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>
                      📍 Full URL: http://{formData.llmConfig.localConfig.host}:{formData.llmConfig.localConfig.port}{formData.llmConfig.localConfig.endpoint}
                    </div>
                  </div>

                  {/* Endpoint Suggestions Component */}
                  <EndpointSuggestions
                    selectedModel={formData.llmConfig.model}
                    selectedProvider={formData.llmConfig.provider}
                    currentHost={formData.llmConfig.localConfig.host}
                    currentPort={formData.llmConfig.localConfig.port}
                    currentEndpoint={formData.llmConfig.localConfig.endpoint}
                    onEndpointSelect={(host, port, endpoint) => {
                      updateLocalConfig('host', host);
                      updateLocalConfig('port', port);
                      updateLocalConfig('endpoint', endpoint);
                    }}
                    onConfigChange={(config) => {
                      console.log('📋 Suggested endpoint config selected:', config);
                    }}
                  />

                  {/* Additional Endpoints */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#495057' }}>
                        🔗 Additional Endpoints ({formData.llmConfig.localEndpoints.length})
                      </div>
                      <button
                        type="button"
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        onClick={addLocalEndpoint}
                      >
                        + Add Endpoint
                      </button>
                    </div>

                    {formData.llmConfig.localEndpoints.map((endpoint) => (
                      <div key={endpoint.id} style={{
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '12px',
                        backgroundColor: endpoint.isActive ? 'white' : '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <input
                            style={{ ...styles.input, marginBottom: '0', flex: 1, marginRight: '12px' }}
                            type="text"
                            placeholder="Endpoint Name"
                            value={endpoint.name}
                            onChange={(e) => updateLocalEndpoint(endpoint.id, 'name', e.target.value)}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <input
                                type="checkbox"
                                checked={endpoint.isActive}
                                onChange={(e) => updateLocalEndpoint(endpoint.id, 'isActive', e.target.checked)}
                              />
                              Active
                            </label>
                            <button
                              type="button"
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer'
                              }}
                              onClick={() => removeLocalEndpoint(endpoint.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        
                        <div style={styles.twoColumn}>
                          <input
                            style={styles.input}
                            type="text"
                            placeholder="Host"
                            value={endpoint.host}
                            onChange={(e) => updateLocalEndpoint(endpoint.id, 'host', e.target.value)}
                          />
                          <input
                            style={styles.input}
                            type="text"
                            placeholder="Port"
                            value={endpoint.port}
                            onChange={(e) => updateLocalEndpoint(endpoint.id, 'port', e.target.value)}
                          />
                        </div>
                        
                        <div style={styles.twoColumn}>
                          <input
                            style={styles.input}
                            type="text"
                            placeholder="API Endpoint"
                            value={endpoint.endpoint}
                            onChange={(e) => updateLocalEndpoint(endpoint.id, 'endpoint', e.target.value)}
                          />
                          <input
                            style={styles.input}
                            type="text"
                            placeholder="Model Name"
                            value={endpoint.model}
                            onChange={(e) => updateLocalEndpoint(endpoint.id, 'model', e.target.value)}
                          />
                        </div>
                        
                        <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '8px' }}>
                          📍 http://{endpoint.host}:{endpoint.port}{endpoint.endpoint} → {endpoint.model}
                        </div>
                      </div>
                    ))}

                    {formData.llmConfig.localEndpoints.length === 0 && (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#6c757d',
                        fontSize: '12px',
                        fontStyle: 'italic'
                      }}>
                        💡 Click "Add Endpoint" to configure additional local models
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Parent Agent Selection - Only for Child Agents */}
          {agentType === 'child' && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                🤝 Parent Agent Connection
              </h3>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#e8f4fd', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid #bee5eb'
              }}>
                <div style={{ fontSize: '13px', color: '#0c5460', lineHeight: '1.5' }}>
                  💡 <strong>Parent Agent:</strong> Choose which main agent this child agent will report to and receive instructions from.
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <select
                  style={styles.input}
                  value={selectedParentAgent || ''}
                  onChange={(e) => setSelectedParentAgent(Number(e.target.value))}
                  required
                >
                  <option value="">Select a Parent Agent...</option>
                  {Array.isArray(mainAgents) && mainAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      🚀 {agent.name} ({agent.model_provider})
                    </option>
                  ))}
                </select>
                {(!Array.isArray(mainAgents) || mainAgents.length === 0) && (
                  <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '8px' }}>
                    ⚠️ No main agents available. Please create a main agent first.
                  </div>
                )}
                {selectedParentAgent && Array.isArray(mainAgents) && (
                  <div style={{ fontSize: '11px', color: '#28a745', marginTop: '8px' }}>
                    ✅ Parent agent selected! This child agent will report to {mainAgents.find(a => a.id === selectedParentAgent)?.name}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Capabilities - Only for Child Agents */}
          {agentType === 'child' && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                ⚡ Capabilities
              </h3>
              <div style={styles.capabilitiesGrid}>
                {capabilities.map((capability) => (
                  <div
                    key={capability}
                    style={{
                      ...styles.capabilityItem,
                      ...(formData.capabilities.includes(capability) ? styles.capabilitySelected : {}),
                    }}
                    onClick={() => toggleCapability(capability)}
                  >
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={formData.capabilities.includes(capability)}
                      readOnly
                    />
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings for Main Agent - Only show for Advanced type */}
          {agentType === 'main' && formData.type === 'advanced' && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                🎛️ Advanced LLM Parameters
              </h3>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid #ffeaa7'
              }}>
                <div style={{ fontSize: '12px', color: '#856404', lineHeight: '1.5' }}>
                  ⚙️ <strong>Advanced Settings:</strong> These control how your AI responds. 
                  Higher temperature = more creative, Lower = more focused.
                </div>
              </div>
              <div style={styles.configSection}>
                <div style={styles.configTitle}>🎚️ Model Configuration</div>
                <div style={styles.twoColumn}>
                  <div>
                    <label style={{ fontSize: '14px', color: '#495057', marginBottom: '8px', display: 'block' }}>
                      🌡️ Temperature: {formData.settings.temperature}
                      <span style={{ fontSize: '11px', color: '#6c757d', display: 'block' }}>
                        0 = Focused, 1 = Balanced, 2 = Creative
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.settings.temperature}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, temperature: parseFloat(e.target.value) }
                      }))}
                      style={styles.range}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', color: '#495057', marginBottom: '8px', display: 'block' }}>
                      🎯 Max Tokens: {formData.settings.maxTokens}
                      <span style={{ fontSize: '11px', color: '#6c757d', display: 'block' }}>
                        Higher = Longer responses
                      </span>
                    </label>
                    <input
                      type="range"
                      min="256"
                      max="8192"
                      step="256"
                      value={formData.settings.maxTokens}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, maxTokens: parseInt(e.target.value) }
                      }))}
                      style={styles.range}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Simple Setup Message for Beginners */}
          {agentType === 'main' && formData.type === 'simple' && (
            <div style={styles.section}>
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#d4edda', 
                borderRadius: '12px', 
                textAlign: 'center',
                border: '1px solid #c3e6cb'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>🎉</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#155724', marginBottom: '8px' }}>
                  All Set! Your Simple AI Assistant is Ready
                </div>
                <div style={{ fontSize: '13px', color: '#155724', lineHeight: '1.5' }}>
                  We've configured everything with the best settings for beginners. 
                  You can always upgrade to "Advanced System" later for more control!
                </div>
              </div>
            </div>
          )}

          {/* Settings for Child Agent - Behavioral Settings */}
          {agentType === 'child' && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                ⚙️ Behavioral Settings
              </h3>
              <div style={styles.settingsGrid}>
                <div style={styles.settingItem}>
                  <span>Auto Response</span>
                  <div
                    style={{
                      ...styles.switch,
                      ...(formData.settings.autoResponse ? styles.switchActive : {}),
                    }}
                    onClick={() => toggleBehavioralSetting('autoResponse')}
                  >
                    <div
                      style={{
                        ...styles.switchThumb,
                        ...(formData.settings.autoResponse ? styles.switchThumbActive : {}),
                      }}
                    />
                  </div>
                </div>
                <div style={styles.settingItem}>
                  <span>Machine Learning</span>
                  <div
                    style={{
                      ...styles.switch,
                      ...(formData.settings.learning ? styles.switchActive : {}),
                    }}
                    onClick={() => toggleBehavioralSetting('learning')}
                  >
                    <div
                      style={{
                        ...styles.switchThumb,
                        ...(formData.settings.learning ? styles.switchThumbActive : {}),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Child Agent Specific Settings */}
          {agentType === 'child' && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                🎓 Training & Workflow Settings
              </h3>
              <div style={styles.configSection}>
                <div style={styles.configTitle}>📋 Workflow Configuration</div>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '12px' }}>
                  This child agent will be trained on specific workflows and will communicate with the main agent upon task completion.
                </p>
                <div style={styles.twoColumn}>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Workflow Board Name"
                    defaultValue={`${formData.name} Training Board`}
                  />
                  <select style={styles.modelSelect}>
                    <option value="beginner">🟢 Beginner Training</option>
                    <option value="intermediate">🟡 Intermediate Training</option>
                    <option value="advanced">🔴 Advanced Training</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              {isEditing ? 'Update' : 'Create'} {agentType === 'main' ? 'Main' : 'Child'} Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentBuilder; 
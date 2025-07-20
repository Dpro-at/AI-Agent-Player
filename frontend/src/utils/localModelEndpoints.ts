// Local AI Model Endpoints Configuration
// Based on research of popular local AI servers and their standard configurations

export interface ModelEndpointConfig {
  name: string;
  description: string;
  server: string;
  defaultHost: string;
  defaultPort: string;
  defaultEndpoint: string;
  supportsStreaming: boolean;
  modelsSupported: string[];
  documentation: string;
  difficulty: "easy" | "medium" | "hard";
  features: string[];
  setup?: string;
  category: "local" | "cloud";
  requiresApiKey: boolean;
  isRecommended?: boolean;
}

// Cloud AI Providers
export const CLOUD_AI_PROVIDERS: Record<string, ModelEndpointConfig> = {
  openai: {
    name: "🤖 OpenAI",
    description: "Official OpenAI API with GPT models.",
    server: "OpenAI",
    defaultHost: "api.openai.com",
    defaultPort: "443",
    defaultEndpoint: "/v1/chat/completions",
    supportsStreaming: true,
    modelsSupported: [
      "gpt-4",
      "gpt-4-turbo",
      "gpt-4o",
      "gpt-3.5-turbo",
      "gpt-3.5-turbo-16k",
    ],
    documentation: "https://platform.openai.com/docs/api-reference",
    difficulty: "easy",
    features: [
      "High quality",
      "Fast responses",
      "Multiple models",
      "Function calling",
    ],
    setup: "Get API key from platform.openai.com",
    category: "cloud",
    requiresApiKey: true,
    isRecommended: true,
  },

  google: {
    name: "🔍 Google Gemini",
    description: "Google Gemini AI models via official API.",
    server: "Google",
    defaultHost: "generativelanguage.googleapis.com",
    defaultPort: "443",
    defaultEndpoint: "/v1beta/models/gemini-pro:generateContent",
    supportsStreaming: true,
    modelsSupported: ["gemini-pro", "gemini-pro-vision", "gemini-ultra"],
    documentation: "https://ai.google.dev/docs",
    difficulty: "easy",
    features: ["Multimodal", "Vision support", "Fast inference", "Free tier"],
    setup: "Get API key from makersuite.google.com",
    category: "cloud",
    requiresApiKey: true,
    isRecommended: true,
  },
};

export const LOCAL_AI_SERVERS: Record<string, ModelEndpointConfig> = {
  // Ollama - Most Popular Local AI Server
  ollama: {
    name: "🦙 Ollama",
    description: "Most popular local AI server. Easy to install and use.",
    server: "Ollama",
    defaultHost: "localhost",
    defaultPort: "11434",
    defaultEndpoint: "/v1/chat/completions",
    supportsStreaming: true,
    modelsSupported: [
      "llama2",
      "llama3",
      "mistral",
      "codellama",
      "vicuna",
      "alpaca",
      "orca-mini",
      "neural-chat",
      "starling-lm",
    ],
    documentation: "https://ollama.ai/docs",
    difficulty: "easy",
    features: [
      "Auto model download",
      "GPU acceleration",
      "Multiple model support",
      "Built-in model management",
    ],
    setup: "Download from ollama.ai and run: ollama pull llama2",
    category: "local",
    requiresApiKey: false,
    isRecommended: true,
  },
};

// Combine all AI providers
export const ALL_AI_PROVIDERS: Record<string, ModelEndpointConfig> = {
  ...CLOUD_AI_PROVIDERS,
  ...LOCAL_AI_SERVERS,
};

// Model-specific endpoint configurations (updated to include cloud providers)
export const MODEL_ENDPOINTS: Record<string, string[]> = {
  // Cloud models
  "gpt-4": ["openai"],
  "gpt-4-turbo": ["openai"],
  "gpt-4o": ["openai"],
  "gpt-3.5-turbo": ["openai"],
  "gemini-pro": ["google"],
  "gemini-pro-vision": ["google"],

  // Llama models (local only)
  llama2: ["ollama"],
  llama3: ["ollama"],
  "llama2:7b": ["ollama"],
  "llama2:13b": ["ollama"],
  "llama2:70b": ["ollama"],

  // Code models
  codellama: ["ollama"],
  "codellama:7b": ["ollama"],
  "codellama:13b": ["ollama"],
  "codellama:34b": ["ollama"],

  // Mistral models
  mistral: ["ollama"],
  "mistral:7b": ["ollama"],
  "mixtral:8x7b": ["ollama"],

  // Other popular models
  vicuna: ["ollama"],
  alpaca: ["ollama"],
  "orca-mini": ["ollama"],
  "neural-chat": ["ollama"],
  "starling-lm": ["ollama"],
  tinyllama: ["ollama"],
};

// Get suggested endpoints for a model
export function getSuggestedEndpoints(
  modelName: string,
  category?: "local" | "cloud" | "all"
): string[] {
  const normalizedModel = modelName.toLowerCase();

  // Direct model match
  if (MODEL_ENDPOINTS[normalizedModel]) {
    let endpoints = MODEL_ENDPOINTS[normalizedModel];

    // Filter by category if specified
    if (category && category !== "all") {
      endpoints = endpoints.filter((serverKey) => {
        const config = ALL_AI_PROVIDERS[serverKey];
        return config && config.category === category;
      });
    }

    return endpoints;
  }

  // Partial model match
  for (const [model, endpoints] of Object.entries(MODEL_ENDPOINTS)) {
    if (normalizedModel.includes(model) || model.includes(normalizedModel)) {
      let filteredEndpoints = endpoints;

      // Filter by category if specified
      if (category && category !== "all") {
        filteredEndpoints = endpoints.filter((serverKey) => {
          const config = ALL_AI_PROVIDERS[serverKey];
          return config && config.category === category;
        });
      }

      return filteredEndpoints;
    }
  }

  // Default suggestions based on category
  if (category === "cloud") {
    return ["openai", "google"];
  } else if (category === "local") {
    return ["ollama"];
  }

  // Default suggestions for unknown models (mixed)
  return ["ollama", "openai", "google"];
}

// Get endpoint configuration by server name
export function getEndpointConfig(
  serverName: string
): ModelEndpointConfig | null {
  return ALL_AI_PROVIDERS[serverName] || null;
}

// Get all available servers sorted by difficulty and category
export function getAllServers(
  category?: "local" | "cloud" | "all"
): ModelEndpointConfig[] {
  let servers = Object.values(ALL_AI_PROVIDERS);

  // Filter by category if specified
  if (category && category !== "all") {
    servers = servers.filter((server) => server.category === category);
  }

  return servers.sort((a, b) => {
    // Sort by category first (cloud first, then local)
    if (a.category !== b.category) {
      return a.category === "cloud" ? -1 : 1;
    }

    // Then by recommendation status
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;

    // Finally by difficulty
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });
}

// Get popular/recommended servers
export function getRecommendedServers(
  category?: "local" | "cloud" | "all"
): ModelEndpointConfig[] {
  let servers = Object.values(ALL_AI_PROVIDERS).filter(
    (server) => server.isRecommended
  );

  // Filter by category if specified
  if (category && category !== "all") {
    servers = servers.filter((server) => server.category === category);
  }

  return servers;
}

// Format endpoint URL (updated for cloud providers)
export function formatEndpointUrl(
  host: string,
  port: string,
  endpoint: string,
  isHttps?: boolean
): string {
  const cleanHost = host || "localhost";
  const cleanPort = port || "8080";
  const cleanEndpoint = endpoint || "/";

  // Determine protocol
  const protocol =
    isHttps ||
    port === "443" ||
    host.includes(".com") ||
    host.includes(".ai") ||
    host.includes(".co")
      ? "https"
      : "http";

  // For cloud providers, don't include port if it's 443 (HTTPS default)
  const portPart =
    protocol === "https" && port === "443" ? "" : `:${cleanPort}`;

  return `${protocol}://${cleanHost}${portPart}${cleanEndpoint}`;
}

// Validate endpoint configuration
export function validateEndpoint(
  host: string,
  port: string,
  endpoint: string
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!host || host.trim() === "") {
    errors.push("Host is required");
  }

  if (!port || port.trim() === "") {
    errors.push("Port is required");
  } else {
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      errors.push("Port must be a valid number between 1 and 65535");
    }
  }

  if (!endpoint || endpoint.trim() === "") {
    errors.push("Endpoint path is required");
  } else if (!endpoint.startsWith("/")) {
    errors.push("Endpoint must start with /");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default {
  LOCAL_AI_SERVERS,
  CLOUD_AI_PROVIDERS,
  ALL_AI_PROVIDERS,
  MODEL_ENDPOINTS,
  getSuggestedEndpoints,
  getEndpointConfig,
  getAllServers,
  getRecommendedServers,
  formatEndpointUrl,
  validateEndpoint,
};

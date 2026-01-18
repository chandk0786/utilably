export type ToolStatus = 'functional' | 'mock' | 'wip' | 'partial';
export type ToolCategory = 'pdf' | 'converter' | 'generator' | 'calculator' | 'editor' | 'utility';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  functionalityScore: number; // 0-100
  lastTested: string;
  lastUpdated: string;
  dependencies: string[];
  hasRealConversion: boolean;
  hasFileProcessing: boolean;
  hasApiIntegration: boolean;
  features: string[];
  priority: number; // 1-10, 10 being highest
  notes?: string;
}

export const toolRegistry: Tool[] = [
      {
    id: 'pdf-editor',
    name: 'pdf-editor',
    slug: '/tools/pdf-editor',
    description: '', // Update description manually
    category: 'pdf',
    status: 'partial',
    functionalityScore: 75,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: ["pdf-lib"],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'loan-calculator',
    name: 'loan-calculator',
    slug: '/tools/loan-calculator',
    description: '', // Update description manually
    category: 'calculator',
    status: 'wip',
    functionalityScore: 25,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'pdf-to-word',
    name: 'pdf-to-word',
    slug: '/tools/pdf-to-word',
    description: '', // Update description manually
    category: 'pdf',
    status: 'partial',
    functionalityScore: 60,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: '/tools/qr-code-generator',
    description: 'Generate customizable QR codes in multiple formats',
    category: 'generator',
    status: 'functional',
    functionalityScore: 100,
    lastTested: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    dependencies: ['qrcode'],
    hasRealConversion: true,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ['custom-colors', 'multiple-formats', 'download', 'logo-support'],
    priority: 8
  },
      {
    id: 'password-generator',
    name: 'password-generator',
    slug: '/tools/password-generator',
    description: '', // Update description manually
    category: 'converter',
    status: 'wip',
    functionalityScore: 35,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'image-converter',
    name: 'image-converter',
    slug: '/tools/image-converter',
    description: '', // Update description manually
    category: 'converter',
    status: 'partial',
    functionalityScore: 60,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'currency-converter',
    name: 'currency-converter',
    slug: '/tools/currency-converter',
    description: '', // Update description manually
    category: 'converter',
    status: 'partial',
    functionalityScore: 50,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: true,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'text-case-converter',
    name: 'text-case-converter',
    slug: '/tools/text-case-converter',
    description: '', // Update description manually
    category: 'editor',
    status: 'partial',
    functionalityScore: 50,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'unit-converter',
    name: 'unit-converter',
    slug: '/tools/unit-converter',
    description: '', // Update description manually
    category: 'converter',
    status: 'wip',
    functionalityScore: 25,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'file-compressor',
    name: 'file-compressor',
    slug: '/tools/file-compressor',
    description: '', // Update description manually
    category: 'converter',
    status: 'partial',
    functionalityScore: 60,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'random-number-generator',
    name: 'random-number-generator',
    slug: '/tools/random-number-generator',
    description: '', // Update description manually
    category: 'converter',
    status: 'partial',
    functionalityScore: 60,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'uuid-generator',
    name: 'uuid-generator',
    slug: '/tools/uuid-generator',
    description: '', // Update description manually
    category: 'generator',
    status: 'partial',
    functionalityScore: 60,
    lastTested: '2026-01-17T20:03:52.009Z',
    lastUpdated: '2026-01-17T20:03:52.009Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'email-signature-generator',
    name: 'email-signature-generator',
    slug: '/tools/email-signature-generator',
    description: '', // Update description manually
    category: 'generator',
    status: 'wip',
    functionalityScore: 25,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'mortgage-calculator',
    name: 'mortgage-calculator',
    slug: '/tools/mortgage-calculator',
    description: '', // Update description manually
    category: 'calculator',
    status: 'partial',
    functionalityScore: 75,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: true,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'emi-calculator',
    name: 'emi-calculator',
    slug: '/tools/emi-calculator',
    description: '', // Update description manually
    category: 'calculator',
    status: 'partial',
    functionalityScore: 50,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'pdf-to-excel',
    name: 'pdf-to-excel',
    slug: '/tools/pdf-to-excel',
    description: '', // Update description manually
    category: 'pdf',
    status: 'partial',
    functionalityScore: 50,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'video-converter',
    name: 'video-converter',
    slug: '/tools/video-converter',
    description: '', // Update description manually
    category: 'converter',
    status: 'partial',
    functionalityScore: 60,
    lastTested: '2026-01-17T20:03:52.009Z',
    lastUpdated: '2026-01-17T20:03:52.009Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'audio-converter',
    name: 'audio-converter',
    slug: '/tools/audio-converter',
    description: '', // Update description manually
    category: 'converter',
    status: 'partial',
    functionalityScore: 60,
    lastTested: '2026-01-17T20:03:52.007Z',
    lastUpdated: '2026-01-17T20:03:52.007Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: [], // Update features manually
    priority: 5
  },
      {
    id: 'code-generator',
    name: 'code-generator',
    slug: '/tools/code-generator',
    description: '', // Update description manually
    category: 'generator',
    status: 'partial',
    functionalityScore: 45,
    lastTested: '2026-01-17T20:03:52.008Z',
    lastUpdated: '2026-01-17T20:03:52.008Z',
    dependencies: [],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: true,
    features: [], // Update features manually
    priority: 5
  }
];

// Helper functions
export function getToolBySlug(slug: string): Tool | undefined {
  return toolRegistry.find(tool => tool.slug === slug);
}

export function getToolById(id: string): Tool | undefined {
  return toolRegistry.find(tool => tool.id === id);
}

export function getToolsByStatus(status: ToolStatus): Tool[] {
  return toolRegistry.filter(tool => tool.status === status);
}

export function getMockTools(): Tool[] {
  return getToolsByStatus('mock');
}

export function getFunctionalTools(): Tool[] {
  return toolRegistry.filter(tool => 
    tool.status === 'functional' && tool.functionalityScore >= 80
  );
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return toolRegistry.filter(tool => tool.category === category);
}

export function getToolsNeedingWork(): Tool[] {
  return toolRegistry.filter(tool => 
    tool.status === 'mock' || 
    tool.status === 'wip' || 
    (tool.status === 'partial' && tool.functionalityScore < 80)
  );
}

export function getOverallProgress(): number {
  const functionalCount = getFunctionalTools().length;
  const totalCount = toolRegistry.length;
  return Math.round((functionalCount / totalCount) * 10000) / 100; // 2 decimal places
}

export function getProgressByCategory(): Record<ToolCategory, number> {
  const categories: ToolCategory[] = ['pdf', 'converter', 'generator', 'calculator', 'editor', 'utility'];
  const progress: Record<ToolCategory, number> = {} as any;
  
  categories.forEach(category => {
    const categoryTools = getToolsByCategory(category);
    if (categoryTools.length === 0) {
      progress[category] = 0;
    } else {
      const functionalInCategory = categoryTools.filter(tool => 
        tool.status === 'functional' && tool.functionalityScore >= 80
      ).length;
      progress[category] = Math.round((functionalInCategory / categoryTools.length) * 100);
    }
  });
  
  return progress;
}

export function getSummary(): {
  total: number;
  functional: number;
  mock: number;
  wip: number;
  partial: number;
  overallProgress: number;
} {
  const total = toolRegistry.length;
  const functional = getFunctionalTools().length;
  const mock = getToolsByStatus('mock').length;
  const wip = getToolsByStatus('wip').length;
  const partial = getToolsByStatus('partial').length;
  const overallProgress = getOverallProgress();
  
  return {
    total,
    functional,
    mock,
    wip,
    partial,
    overallProgress
  };
}

export function getPriorityTools(limit: number = 5): Tool[] {
  return [...toolRegistry]
    .filter(tool => tool.status !== 'functional' || tool.functionalityScore < 80)
    .sort((a, b) => {
      // Sort by priority (highest first), then by status (mock > wip > partial), then by score (lowest first)
      if (b.priority !== a.priority) return b.priority - a.priority;
      
      const statusOrder = { mock: 3, wip: 2, partial: 1, functional: 0 };
      const statusDiff = statusOrder[b.status] - statusOrder[a.status];
      if (statusDiff !== 0) return statusDiff;
      
      return a.functionalityScore - b.functionalityScore;
    })
    .slice(0, limit);
}

// Utility function to update tool status
export function updateToolStatus(toolId: string, updates: Partial<Tool>): Tool | null {
  const index = toolRegistry.findIndex(tool => tool.id === toolId);
  if (index === -1) return null;
  
  toolRegistry[index] = {
    ...toolRegistry[index],
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  return toolRegistry[index];
}

// Export for convenience
export const allToolIds = toolRegistry.map(tool => tool.id);
export const allToolNames = toolRegistry.map(tool => tool.name);
export const mockToolIds = toolRegistry.filter(tool => tool.status === 'mock').map(tool => tool.id);
export const functionalToolIds = toolRegistry.filter(tool => 
  tool.status === 'functional' && tool.functionalityScore >= 80
).map(tool => tool.id);
#!/usr/bin/env node

import { ToolAnalyzer } from '../src/lib/tool-analyzer';
import fs from 'fs';
import path from 'path';

async function updateRegistry() {
  console.log('🔄 Updating tool registry...');
  
  const analyzer = new ToolAnalyzer();
  const analysis = analyzer.analyzeAllTools();
  
  // Read current registry
  const registryPath = path.join(process.cwd(), 'src/lib/tool-registry.ts');
  let registryContent = fs.readFileSync(registryPath, 'utf-8');
  
  // Update each tool in registry
  Object.entries(analysis).forEach(([toolId, toolAnalysis]) => {
    // Find and update the tool entry
    const toolPattern = new RegExp(`id: ['"]${toolId}['"][\\s\\S]*?},?\\n\\s*]`, 'm');
    
    const updatedEntry = `  {\n    id: '${toolId}',\n    name: '${toolAnalysis.toolName.replace(/'/g, "\\'")}',\n    slug: '/tools/${toolId}',\n    description: '', // Update description manually\n    category: '${getCategory(toolId)}',\n    status: '${toolAnalysis.status}',\n    functionalityScore: ${toolAnalysis.functionalityScore},\n    lastTested: '${new Date().toISOString()}',\n    lastUpdated: '${new Date().toISOString()}',\n    dependencies: ${JSON.stringify(getDependencies(toolAnalysis))},\n    hasRealConversion: ${toolAnalysis.hasFileProcessing},\n    hasFileProcessing: ${toolAnalysis.hasFileProcessing},\n    hasApiIntegration: ${toolAnalysis.hasApiCalls},\n    features: [], // Update features manually\n    priority: ${getPriority(toolId, toolAnalysis)}\n  }`;
    
    // Simple replacement - in production you'd want a proper parser
    registryContent = registryContent.replace(
      new RegExp(`{\\s*id: ['"]${toolId}['"][\\s\\S]*?\\n\\s*},?`),
      updatedEntry
    );
  });
  
  // Write updated registry
  fs.writeFileSync(registryPath, registryContent);
  console.log('✅ Tool registry updated!');
  
  // Helper functions
  function getCategory(toolId: string): string {
    const categories: Record<string, string> = {
      'pdf': 'pdf',
      'word': 'converter',
      'excel': 'converter',
      'image': 'converter',
      'video': 'converter',
      'audio': 'converter',
      'qr': 'generator',
      'password': 'generator',
      'uuid': 'generator',
      'code': 'generator',
      'calculator': 'calculator',
      'loan': 'calculator',
      'mortgage': 'calculator',
      'emi': 'calculator',
      'currency': 'converter',
      'unit': 'converter',
      'text': 'editor',
      'email': 'generator',
      'compressor': 'converter'
    };
    
    for (const [key, category] of Object.entries(categories)) {
      if (toolId.includes(key)) return category;
    }
    return 'converter';
  }
  
  function getDependencies(analysis: any): string[] {
    const deps: string[] = [];
    if (analysis.hasExternalDependencies) {
      if (analysis.toolName.toLowerCase().includes('pdf')) deps.push('pdf-lib');
      if (analysis.toolName.toLowerCase().includes('qr')) deps.push('qrcode');
      if (analysis.toolName.toLowerCase().includes('image')) deps.push('canvas');
    }
    return deps;
  }
  
  function getPriority(toolId: string, analysis: any): number {
    // Higher priority for mock tools with low scores
    if (analysis.status === 'mock') {
      if (analysis.functionalityScore < 20) return 10;
      if (analysis.functionalityScore < 40) return 8;
      return 6;
    }
    
    // Medium priority for WIP tools
    if (analysis.status === 'wip' || analysis.status === 'partial') {
      return 5;
    }
    
    // Low priority for functional tools
    return 3;
  }
}

updateRegistry().catch(console.error);
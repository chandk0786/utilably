import fs from 'fs';
import path from 'path';
import { Tool, ToolStatus } from './tool-registry';

export interface ToolAnalysis {
  toolName: string;
  path: string;
  hasComplexLogic: boolean;
  hasFileProcessing: boolean;
  hasExternalDependencies: boolean;
  hasApiCalls: boolean;
  hasMockData: boolean;
  hasRealFunctionality: boolean;
  status: ToolStatus;
  functionalityScore: number;
  issues: string[];
}

export class ToolAnalyzer {
  private toolsPath: string;
  
  constructor(toolsPath: string = path.join(process.cwd(), 'src/app/tools')) {
    this.toolsPath = toolsPath;
  }
  
  private readToolFiles(toolName: string): string[] {
    const toolPath = path.join(this.toolsPath, toolName);
    const files: string[] = [];
    
    if (!fs.existsSync(toolPath)) {
      return files;
    }
    
    const stat = fs.statSync(toolPath);
    
    // Skip if it's not a directory (like page.tsx)
    if (!stat.isDirectory()) {
      return files;
    }
    
    const readDir = (dir: string) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          readDir(fullPath);
        } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
          files.push(fullPath);
        }
      });
    };
    
    readDir(toolPath);
    return files;
  }
  
  private analyzeFileContent(content: string): {
    hasComplexLogic: boolean;
    hasFileProcessing: boolean;
    hasExternalDependencies: boolean;
    hasApiCalls: boolean;
    hasMockData: boolean;
  } {
    const mockDataRegex = /mockData|sampleData|placeholder|TODO.*conversion|FIXME.*real|coming.*soon|not.*implemented/i;
    
    return {
      hasComplexLogic: /useState\(|useEffect\(|useReducer\(|try\s*{/.test(content),
      hasFileProcessing: /FileReader|FormData|Blob|File|canvas|PDFDocument|drawText|pdf-lib/.test(content),
      hasExternalDependencies: /import.*from ['"](pdf-lib|qrcode|ffmpeg|jspdf|mammoth|docx|html2canvas|jszip)['"]/i.test(content),
      hasApiCalls: /fetch\(|axios\.|\.post\(|\.get\(|await\s+fetch/.test(content),
      hasMockData: mockDataRegex.test(content)
    };
  }
  
  analyzeTool(toolName: string): ToolAnalysis {
    const files = this.readToolFiles(toolName);
    const issues: string[] = [];
    
    if (files.length === 0) {
      return {
        toolName,
        path: path.join(this.toolsPath, toolName),
        hasComplexLogic: false,
        hasFileProcessing: false,
        hasExternalDependencies: false,
        hasApiCalls: false,
        hasMockData: true,
        hasRealFunctionality: false,
        status: 'mock',
        functionalityScore: 0,
        issues: ['No TypeScript/TSX files found or not a directory']
      };
    }
    
    let totalScore = 0;
    const indicators = {
      hasComplexLogic: false,
      hasFileProcessing: false,
      hasExternalDependencies: false,
      hasApiCalls: false,
      hasMockData: false
    };
    
    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const fileIndicators = this.analyzeFileContent(content);
        
        // Aggregate indicators
        Object.keys(indicators).forEach(key => {
          indicators[key as keyof typeof indicators] ||= 
            fileIndicators[key as keyof typeof fileIndicators];
        });
        
        // Calculate file score
        let fileScore = 0;
        if (fileIndicators.hasComplexLogic) fileScore += 25;
        if (fileIndicators.hasFileProcessing) fileScore += 25;
        if (fileIndicators.hasExternalDependencies) fileScore += 25;
        if (fileIndicators.hasApiCalls) fileScore += 15;
        if (!fileIndicators.hasMockData) fileScore += 10;
        
        totalScore += fileScore;
        
        // Check for issues
        if (fileIndicators.hasMockData) {
          issues.push(`Mock data found in ${path.basename(file)}`);
        }
        if (content.includes('TODO') || content.includes('FIXME')) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('TODO') || line.includes('FIXME')) {
              issues.push(`Line ${index + 1} in ${path.basename(file)}: ${line.trim()}`);
            }
          });
        }
      } catch (error) {
        issues.push(`Error reading ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
    
    const avgScore = files.length > 0 ? Math.min(100, Math.round(totalScore / files.length)) : 0;
    
    // Determine status
    let status: ToolStatus = 'mock';
    if (avgScore >= 80) {
      status = 'functional';
    } else if (avgScore >= 40) {
      status = 'partial';
    } else if (avgScore > 0) {
      status = 'wip';
    }
    
    const hasRealFunctionality = indicators.hasFileProcessing || 
                                 indicators.hasExternalDependencies || 
                                 indicators.hasApiCalls;
    
    return {
      toolName,
      path: path.join(this.toolsPath, toolName),
      ...indicators,
      hasRealFunctionality,
      status,
      functionalityScore: avgScore,
      issues
    };
  }
  
  analyzeAllTools(): Record<string, ToolAnalysis> {
    if (!fs.existsSync(this.toolsPath)) {
      return {};
    }
    
    const items = fs.readdirSync(this.toolsPath);
    const results: Record<string, ToolAnalysis> = {};
    
    items.forEach(item => {
      const fullPath = path.join(this.toolsPath, item);
      const stat = fs.statSync(fullPath);
      
      // Only analyze directories, skip files (like page.tsx)
      if (stat.isDirectory()) {
        results[item] = this.analyzeTool(item);
      } else {
        console.log(`Skipping file: ${item} (not a tool directory)`);
      }
    });
    
    return results;
  }
  
  generateReport(): string {
    const analysis = this.analyzeAllTools();
    let report = '# Tool Status Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    const categories = {
      functional: [] as ToolAnalysis[],
      partial: [] as ToolAnalysis[],
      wip: [] as ToolAnalysis[],
      mock: [] as ToolAnalysis[]
    };
    
    Object.values(analysis).forEach(tool => {
      categories[tool.status].push(tool);
    });
    
    report += '## Summary\n';
    report += `- Total Tools: ${Object.keys(analysis).length}\n`;
    report += `- Functional: ${categories.functional.length}\n`;
    report += `- Partial: ${categories.partial.length}\n`;
    report += `- WIP: ${categories.wip.length}\n`;
    report += `- Mock: ${categories.mock.length}\n`;
    report += `- Overall Progress: ${Math.round((categories.functional.length / Object.keys(analysis).length) * 100)}%\n\n`;
    
    report += '## Mock Tools (Need Attention)\n';
    categories.mock.forEach(tool => {
      report += `### ${tool.toolName}\n`;
      report += `- Score: ${tool.functionalityScore}%\n`;
      report += `- Issues: ${tool.issues.length}\n`;
      if (tool.issues.length > 0) {
        tool.issues.slice(0, 3).forEach(issue => {
          report += `  - ${issue}\n`;
        });
      }
      report += '\n';
    });
    
    return report;
  }
}
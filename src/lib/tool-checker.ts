import { Tool, toolRegistry, getOverallProgress } from './tool-registry';


export class ToolChecker {
  async checkAllTools(): Promise<{
    functional: Tool[];
    mock: Tool[];
    wip: Tool[];
    overallProgress: number;
    summary: {
      total: number;
      functional: number;
      mock: number;
      wip: number;
      averageScore: number;
    };
  }> {
    // Use registry data directly
    const functional = toolRegistry.filter(t => t.status === 'functional' && t.functionalityScore >= 80);
    const mock = toolRegistry.filter(t => t.status === 'mock');
    const wip = toolRegistry.filter(t => t.status === 'wip' || t.status === 'partial');

    const averageScore = toolRegistry.length > 0 
      ? Math.round(toolRegistry.reduce((sum, t) => sum + t.functionalityScore, 0) / toolRegistry.length)
      : 0;

    return {
      functional,
      mock,
      wip,
      overallProgress: getOverallProgress(),
      summary: {
        total: toolRegistry.length,
        functional: functional.length,
        mock: mock.length,
        wip: wip.length,
        averageScore
      }
    };
  }

  generateStatusMessage(): string {
    const progress = getOverallProgress();
    
    if (progress >= 90) {
      return `🎉 Excellent! ${progress}% complete`;
    } else if (progress >= 70) {
      return `🚀 Good progress! ${progress}% complete`;
    } else if (progress >= 50) {
      return `🔄 Halfway there! ${progress}% complete`;
    } else {
      return `⚡ Need attention! Only ${progress}% complete`;
    }
  }

  getPriorityTools(limit: number = 5): Tool[] {
    return [...toolRegistry]
      .sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.functionalityScore - b.functionalityScore;
      })
      .slice(0, limit);
  }
}

export const toolChecker = new ToolChecker();
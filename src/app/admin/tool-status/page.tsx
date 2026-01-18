'use client'; // <-- ADD THIS LINE AT THE TOP

import { ToolStatusBadge } from '@/components/ToolStatusBadge';
import { ToolStatus, toolRegistry, getSummary, getPriorityTools, getOverallProgress } from '@/lib/tool-registry';
import { CheckCircle, AlertCircle, Clock, TrendingUp, Download, BarChart3, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardData {
  summary: {
    total: number;
    functional: number;
    mock: number;
    wip: number;
    partial: number;
    overallProgress: number;
  };
  priorityTools: Array<{
    id: string;
    name: string;
    status: ToolStatus;
    functionalityScore: number;
    priority: number;
    description: string;
    category: string;
  }>;
  generatedAt: string;
}

export default function ToolStatusPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use the registry data directly
      // In production, you'd fetch from an API
      const summary = getSummary();
      const priorityTools = getPriorityTools(5);
      const overallProgress = getOverallProgress();
      
      setData({
        summary,
        priorityTools: priorityTools.map(tool => ({
          id: tool.id,
          name: tool.name,
          status: tool.status,
          functionalityScore: tool.functionalityScore,
          priority: tool.priority,
          description: tool.description,
          category: tool.category
        })),
        generatedAt: new Date().toISOString()
      });
      
    } catch (err) {
      setError('Failed to load tool data');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleDownloadReport = () => {
    // Simple client-side report generation
    const reportLines = [
      '# Tool Status Report',
      '',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '## Summary',
      `- Total Tools: ${data?.summary.total || 0}`,
      `- Functional: ${data?.summary.functional || 0}`,
      `- Mock Tools: ${data?.summary.mock || 0}`,
      `- WIP: ${data?.summary.wip || 0}`,
      `- Partial: ${data?.summary.partial || 0}`,
      `- Overall Progress: ${data?.summary.overallProgress || 0}%`,
      '',
      '## Priority Tools',
      ...(data?.priorityTools.map((tool, i) => 
        `${i + 1}. ${tool.name} (${tool.status}, ${tool.functionalityScore}%, Priority: ${tool.priority}/10)`
      ) || []),
      '',
      '## All Tools',
      ...toolRegistry.map(tool => 
        `- ${tool.name}: ${tool.status} (${tool.functionalityScore}%)`
      )
    ];

    const report = reportLines.join('\n');
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tool-status-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tool status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tool Status Dashboard</h1>
          <p className="text-gray-600">Automatic tracking of functional vs mock tools</p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date(data.generatedAt).toLocaleString()}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tools</p>
                <p className="text-3xl font-bold mt-2">{data.summary.total}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Functional</p>
                <p className="text-3xl font-bold mt-2">{data.summary.functional}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Mock Tools</p>
                <p className="text-3xl font-bold mt-2">{data.summary.mock}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-3xl font-bold mt-2">{data.summary.overallProgress}%</p>
              </div>
              <Clock className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Overall Progress</h2>
            <span className="text-sm font-medium text-gray-700">{data.summary.overallProgress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${data.summary.overallProgress}%` }}
            ></div>
          </div>
          <p className="mt-4 text-gray-600 text-sm">
            {data.summary.functional}/{data.summary.total} tools functional • {data.summary.mock} mock tools remaining
          </p>
        </div>
        
        {/* Priority Tools */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Top Priority Tools to Fix
          </h2>
          <div className="space-y-4">
            {data.priorityTools.map((tool, index) => (
              <div key={tool.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-800 font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-500">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <ToolStatusBadge status={tool.status} score={tool.functionalityScore} size="sm" />
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      Priority: <strong>{tool.priority}/10</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* All Tools Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">All Tools Status</h2>
            <p className="text-sm text-gray-500 mt-1">{toolRegistry.length} tools total</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {toolRegistry.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{tool.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{tool.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ToolStatusBadge status={tool.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              tool.functionalityScore >= 80 ? 'bg-green-500' :
                              tool.functionalityScore >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, tool.functionalityScore)}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-gray-900">{tool.functionalityScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              tool.priority >= 8 ? 'bg-red-500' :
                              tool.priority >= 5 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(tool.priority / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{tool.priority}/10</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Analysis'}
          </button>
          
          <button 
            onClick={() => {
              // Update registry logic would go here
              alert('Registry updated!');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Update Registry
          </button>
          
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-blue-900">Progress Summary</h3>
              <p className="text-sm text-blue-700">
                You're {data.summary.overallProgress}% complete. {data.summary.functional} out of {data.summary.total} tools are fully functional.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{data.summary.overallProgress}%</div>
              <div className="text-sm text-blue-700">Complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
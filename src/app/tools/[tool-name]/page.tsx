import { ToolStatusBadge, useToolStatus } from '@/components/ToolStatusBadge';
import { getToolBySlug } from '@/lib/tool-registry';

export default function ToolPage({ params }: { params: { toolName: string } }) {
  const tool = getToolBySlug(`/tools/${params.toolName}`);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tool?.name || params.toolName}</h1>
          <p className="text-gray-600 mt-2">{tool?.description}</p>
        </div>
        {tool && (
          <ToolStatusBadge 
            status={tool.status} 
            score={tool.functionalityScore}
            size="lg"
          />
        )}
      </div>
      
      {/* Rest of your tool component */}
    </div>
  );
}
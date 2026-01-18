import { ToolStatusBadge } from '@/components/ToolStatusBadge';

export default function TestBadgePage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Tool Status Badge Test</h1>
      
      <div className="space-y-2">
        <ToolStatusBadge status="functional" score={100} />
        <ToolStatusBadge status="partial" score={65} />
        <ToolStatusBadge status="wip" score={40} />
        <ToolStatusBadge status="mock" score={20} />
      </div>
      
      <div className="space-y-2 mt-6">
        <h2 className="text-lg font-semibold">Sizes:</h2>
        <ToolStatusBadge status="functional" size="sm" />
        <ToolStatusBadge status="mock" size="md" />
        <ToolStatusBadge status="wip" size="lg" />
      </div>
    </div>
  );
}
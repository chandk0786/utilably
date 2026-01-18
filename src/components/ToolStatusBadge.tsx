'use client';

import { CheckCircle, AlertCircle, Clock, Wrench } from 'lucide-react';
import { ToolStatus } from '@/lib/tool-registry';

interface ToolStatusBadgeProps {
  status: ToolStatus;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function ToolStatusBadge({ 
  status, 
  score, 
  size = 'md', 
  showText = true,
  className = ''
}: ToolStatusBadgeProps) {
  const statusConfig = {
    functional: {
      icon: CheckCircle,
      text: 'Fully Functional',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
      iconColor: 'text-green-500',
      scoreColor: 'text-green-700'
    },
    partial: {
      icon: CheckCircle,
      text: 'Partially Working',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      iconColor: 'text-blue-500',
      scoreColor: 'text-blue-700'
    },
    wip: {
      icon: Wrench,
      text: 'In Progress',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
      iconColor: 'text-yellow-500',
      scoreColor: 'text-yellow-700'
    },
    mock: {
      icon: AlertCircle,
      text: 'Demo Version',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      iconColor: 'text-red-500',
      scoreColor: 'text-red-700'
    }
  };

  const sizeConfig = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2'
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  const sizeClasses = sizeConfig[size];

  return (
    <div className={`
      inline-flex items-center rounded-full border font-medium
      ${config.bgColor} ${config.textColor} ${config.borderColor}
      ${sizeClasses} ${className}
    `}>
      <Icon className={`
        flex-shrink-0 ${config.iconColor}
        ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}
      `} />
      {showText && <span>{config.text}</span>}
      {score !== undefined && (
        <span className={`font-bold ${config.scoreColor}`}>
          {score}%
        </span>
      )}
    </div>
  );
}

// Remove the useToolStatus hook if not needed to simplify
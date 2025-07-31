import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'gray' | 'red';
  className?: string;
}

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    green: {
      text: 'text-green-600',
      bg: 'bg-green-100'
    },
    yellow: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    orange: {
      text: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    gray: {
      text: 'text-gray-600',
      bg: 'bg-gray-100'
    },
    red: {
      text: 'text-red-600',
      bg: 'bg-red-100'
    }
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.gray;
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  className = ''
}) => {
  const colorClasses = getColorClasses(color);

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-2xl font-bold ${colorClasses.text}`}>
              {value}
            </div>
            <div className="text-sm text-gray-600">{title}</div>
          </div>
          <div className={`p-3 ${colorClasses.bg} rounded-full flex items-center justify-center`}>
            <div className={`h-6 w-6 ${colorClasses.text} flex items-center justify-center`}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
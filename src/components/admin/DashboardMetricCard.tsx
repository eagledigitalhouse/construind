import React from 'react';
import DashboardCard from './DashboardCard';
import { LucideIcon } from 'lucide-react';

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'indigo' | 'yellow' | 'red' | 'green' | 'blue' | 'purple' | 'orange';
  percentage?: string;
  trend?: 'up' | 'down';
  subtitle?: string;
}

const getColorClasses = (color: string) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500',
      badge: 'bg-indigo-500/10 text-indigo-500'
    },
    yellow: {
      bg: 'bg-yellow-500',
      badge: 'bg-yellow-500/10 text-yellow-500'
    },
    red: {
      bg: 'bg-red-500',
      badge: 'bg-red-500/10 text-red-500'
    },
    green: {
      bg: 'bg-green-500',
      badge: 'bg-green-500/10 text-green-500'
    },
    blue: {
      bg: 'bg-blue-500',
      badge: 'bg-blue-500/10 text-blue-500'
    },
    purple: {
      bg: 'bg-purple-500',
      badge: 'bg-purple-500/10 text-purple-500'
    },
    orange: {
      bg: 'bg-orange-500',
      badge: 'bg-orange-500/10 text-orange-500'
    }
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.indigo;
};

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  percentage,
  trend,
  subtitle = 'Desde a semana passada'
}) => {
  const colorClasses = getColorClasses(color);

  return (
    <DashboardCard>
      <div>
        <div className="flex">
          <div className="flex-1 text-base font-medium text-gray-800 dark:text-white">
            {title}
          </div>
          <div className="flex-none">
            <div className={`h-10 w-10 rounded-full ${colorClasses.bg} text-white text-2xl flex items-center justify-center`}>
              <Icon size={20} />
            </div>
          </div>
        </div>
        <div>
          <span className="text-2xl font-medium text-gray-800 dark:text-white">
            {value}
          </span>
          {percentage && (
            <span className="space-x-2 block mt-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses.badge}`}>
                {percentage}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </span>
            </span>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default DashboardMetricCard;
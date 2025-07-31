import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import MetricCard from '@/components/ui/metric-card';

interface MetricCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'gray';
}

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  metrics?: MetricCard[];
  actions?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary';
  }[];
  onRefresh?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}



const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  subtitle,
  metrics = [],
  actions = [],
  onRefresh,
  loading = false,
  children
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a2856]">{title}</h1>
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          )}
          
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`flex items-center gap-2 ${
                action.variant === 'secondary'
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-[#00d856] hover:bg-[#00d856]/90'
              }`}
              size="sm"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Cards de Métricas */}
      {metrics.length > 0 && (
        <div className={`grid gap-4 ${
          metrics.length <= 4 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
        }`}>
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
            />
          ))}
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
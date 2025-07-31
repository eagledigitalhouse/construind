import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
}

const DashboardIcon: React.FC<DashboardIconProps> = ({ 
  icon: Icon, 
  className = '', 
  size = 24 
}) => {
  return (
    <Icon 
      size={size} 
      className={className} 
    />
  );
};

export default DashboardIcon;
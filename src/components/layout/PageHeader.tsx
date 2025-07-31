import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface ActionButton {
  label: string;
  icon: LucideIcon;
  variant: "default" | "outline";
  onClick: () => void;
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ActionButton[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon: Icon, actions }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white rounded-2xl sm:rounded-3xl p-6 lg:p-8 border border-gray-100/80 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-none">{title}</h1>
            <p className="text-gray-600 mt-1">
              {description}
            </p>
          </div>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant}
                disabled={action.disabled}
                className={action.variant === "outline" 
                  ? "border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl px-6 py-3 h-auto font-semibold"
                  : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3 h-auto font-semibold"
                }
              >
                <action.icon className="h-5 w-5 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
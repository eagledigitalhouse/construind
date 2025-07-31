import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerslot?: React.ReactNode;
  className?: string;
  bodyClass?: string;
  noborder?: boolean;
  titleClass?: string;
  headerClass?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  title,
  subtitle,
  headerslot,
  className = '',
  bodyClass = 'px-5 py-4',
  noborder,
  titleClass = '',
  headerClass = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
        className
      }`}
    >
      {(title || subtitle) && (
        <header
          className={`px-5 py-4 border-b border-gray-200 dark:border-gray-700 ${
            noborder ? 'border-b-0' : ''
          } ${headerClass}`}
        >
          <div>
            {title && (
              <div className={`text-lg font-semibold text-gray-800 dark:text-white ${titleClass}`}>
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </div>
            )}
          </div>
          {headerslot && <div className="flex-shrink-0">{headerslot}</div>}
        </header>
      )}
      <main className={bodyClass}>{children}</main>
    </div>
  );
};

export default DashboardCard;
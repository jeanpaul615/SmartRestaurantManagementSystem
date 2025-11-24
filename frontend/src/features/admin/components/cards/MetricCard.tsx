// frontend/src/features/admin/components/cards/MetricCard.tsx
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBgColor,
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs ayer</span>
          </div>
        </div>

        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

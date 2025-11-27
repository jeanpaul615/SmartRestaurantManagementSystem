// frontend/src/features/admin/components/cards/ChartCard.tsx
import type { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, action }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

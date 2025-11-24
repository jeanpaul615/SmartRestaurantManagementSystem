// frontend/src/features/admin/components/widgets/RecentOrders.tsx
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  table: string;
  items: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  time: string;
}

const orders: Order[] = [
  { id: '#1234', table: 'Mesa 5', items: 3, total: 45.50, status: 'preparing', time: 'Hace 5 min' },
  { id: '#1235', table: 'Mesa 12', items: 5, total: 78.20, status: 'ready', time: 'Hace 12 min' },
  { id: '#1236', table: 'Mesa 3', items: 2, total: 32.00, status: 'pending', time: 'Hace 2 min' },
  { id: '#1237', table: 'Mesa 8', items: 4, total: 56.75, status: 'delivered', time: 'Hace 25 min' },
  { id: '#1238', table: 'Mesa 15', items: 6, total: 92.30, status: 'preparing', time: 'Hace 8 min' },
];

const statusConfig = {
  pending: { label: 'Pendiente', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
  preparing: { label: 'En Cocina', color: 'text-blue-600', bg: 'bg-blue-50', icon: AlertCircle },
  ready: { label: 'Listo', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  delivered: { label: 'Entregado', color: 'text-gray-600', bg: 'bg-gray-50', icon: CheckCircle },
};

export const RecentOrders: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h3>
        <p className="text-sm text-gray-500 mt-1">Últimos pedidos del día</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {orders.map((order) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;
          
          return (
            <div 
              key={order.id} 
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 ${status.bg} rounded-lg flex items-center justify-center`}>
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{order.table}</span>
                    </div>
                    <p className="text-sm text-gray-500">{order.items} items • {order.time}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">${order.total.toFixed(2)}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-200 text-center">
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          Ver todos los pedidos →
        </button>
      </div>
    </div>
  );
};

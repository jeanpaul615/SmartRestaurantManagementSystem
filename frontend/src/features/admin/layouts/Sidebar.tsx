// frontend/src/features/admin/layouts/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  ChefHat,
  Table2,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Pedidos', path: '/dashboard/orders', icon: ShoppingBag, badge: 5 },
  { name: 'Menú', path: '/dashboard/menu', icon: UtensilsCrossed },
  { name: 'Mesas', path: '/dashboard/tables', icon: Table2 },
  { name: 'Cocina', path: '/dashboard/kitchen', icon: ChefHat, badge: 3 },
  { name: 'Reservaciones', path: '/dashboard/reservations', icon: Calendar },
  { name: 'Personal', path: '/dashboard/staff', icon: Users },
  { name: 'Análisis', path: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Notificaciones', path: '/dashboard/notifications', icon: Bell },
  { name: 'Configuración', path: '/dashboard/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && <div className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SmartRestaurant</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-88px)]">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg
                  transition-all duration-200 group
                  ${active ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${active ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>

                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@restaurant.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

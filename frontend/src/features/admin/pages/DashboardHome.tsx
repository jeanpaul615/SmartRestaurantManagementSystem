// frontend/src/features/admin/pages/DashboardHome.tsx
import { DollarSign, ShoppingBag, Users, Star, Calendar, TrendingUp } from 'lucide-react';
import { MetricCard } from '../components/cards/MetricCard';
import { ChartCard } from '../components/cards/ChartCard';
import { RevenueChart } from '../components/charts/RevenueChart';
import { OrdersChart } from '../components/charts/OrdersChart';
import { RecentOrders } from '../components/widgets/RecentOrders';

export const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido de nuevo, aquí está el resumen de hoy</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas del Día"
          value="$12,450"
          change={15}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <MetricCard
          title="Total Pedidos"
          value="156"
          change={8}
          icon={ShoppingBag}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <MetricCard
          title="Clientes Hoy"
          value="89"
          change={12}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <MetricCard
          title="Rating Promedio"
          value="4.8"
          change={0.2}
          icon={Star}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Ingresos Semanales"
          subtitle="Últimos 7 días"
          action={
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option>Última semana</option>
              <option>Último mes</option>
              <option>Último año</option>
            </select>
          }
        >
          <RevenueChart />
        </ChartCard>

        <ChartCard title="Pedidos por Hora" subtitle="Distribución del día de hoy">
          <OrdersChart />
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Reservations Card */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-orange-100 text-sm font-medium">Reservaciones Hoy</p>
                <h3 className="text-3xl font-bold mt-1">24</h3>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+18% vs ayer</span>
            </div>
          </div>

          {/* Popular Dishes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Platos Populares</h3>
            <div className="space-y-3">
              {[
                { name: 'Pasta Carbonara', orders: 45, trend: '+12%' },
                { name: 'Hamburguesa Premium', orders: 38, trend: '+8%' },
                { name: 'Pizza Margherita', orders: 32, trend: '+5%' },
              ].map((dish, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-600">#{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dish.name}</p>
                      <p className="text-xs text-gray-500">{dish.orders} pedidos</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-600">{dish.trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition text-sm font-medium">
                Nuevo Pedido
              </button>
              <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
                Ver Mesas
              </button>
              <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
                Agregar Reservación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

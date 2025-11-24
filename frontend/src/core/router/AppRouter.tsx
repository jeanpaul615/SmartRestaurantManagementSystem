import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RootRedirect } from './RootRedirect';
import { DashboardLayout } from '@/features/admin/layouts/DashboardLayout';
import { DashboardHome } from '@/features/admin/pages/DashboardHome';

export const AppRouter = () => {
  return (
    <Routes>
      {/* ========================================
          🔓 RUTAS PÚBLICAS
          ======================================== */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Redirigir raíz según autenticación */}
      <Route path="/" element={<RootRedirect />} />

      {/* ========================================
          🔐 RUTAS PROTEGIDAS
          ======================================== */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard con Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/menu" element={<div className="p-6">Menu - En construcción</div>} />
          <Route path="/tables" element={<div className="p-6">Tables - En construcción</div>} />
          <Route path="/orders" element={<div className="p-6">Orders - En construcción</div>} />
          <Route path="/kitchen" element={<div className="p-6">Kitchen - En construcción</div>} />
          <Route path="/reservations" element={<div className="p-6">Reservations - En construcción</div>} />
          <Route path="/staff" element={<div className="p-6">Staff - En construcción</div>} />
          <Route path="/analytics" element={<div className="p-6">Analytics - En construcción</div>} />
          <Route path="/notifications" element={<div className="p-6">Notifications - En construcción</div>} />
          <Route path="/settings" element={<div className="p-6">Settings - En construcción</div>} />
        </Route>
      </Route>

      {/* ========================================
          🔐 RUTAS POR ROL
          ======================================== */}
      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/*" element={<div>Admin Panel</div>} />
      </Route>

      {/* Waiter */}
      <Route element={<ProtectedRoute allowedRoles={['waiter']} />}>
        <Route path="/waiter/*" element={<div>Waiter Panel</div>} />
      </Route>

      {/* Chef */}
      <Route element={<ProtectedRoute allowedRoles={['chef']} />}>
        <Route path="/kitchen/*" element={<div>Kitchen Panel</div>} />
      </Route>

      {/* ========================================
          ❌ RUTAS DE ERROR
          ======================================== */}
      <Route path="/unauthorized" element={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
            <p className="text-xl text-gray-700">No tienes permiso para acceder a esta página</p>
          </div>
        </div>
      } />

      <Route path="*" element={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-700">Página no encontrada</p>
          </div>
        </div>
      } />
    </Routes>
  );
};

import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
  return (
    <Routes>
      {/* ========================================
          🔓 RUTAS PÚBLICAS
          ======================================== */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Redirigir raíz a login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ========================================
          🔐 RUTAS PROTEGIDAS
          ======================================== */}
      <Route element={<ProtectedRoute />}>
        {/* Aquí irán tus rutas protegidas */}
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/menu" element={<div>Menu</div>} />
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

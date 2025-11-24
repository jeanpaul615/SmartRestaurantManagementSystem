// frontend/src/core/router/RootRedirect.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/store/AuthContext';

export const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Si está autenticado, ir al dashboard; si no, al login
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/store/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './core/router/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

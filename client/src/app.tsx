import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './app/no-auth/welcome/welcome';
import DashboardLayout from './app/auth/layout';
import ErrorPage from './components/error-page';
import AuthProvider from './components/auth-provider';
import AuthRoute from './components/auth-route';
import NoAuthRoute from './components/no-auth-route';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <NoAuthRoute>
        <Welcome />
      </NoAuthRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element: (
      <AuthRoute>
        <DashboardLayout />
      </AuthRoute>
    ),
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
    },
  },
});

const App = (): JSX.Element => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RouterProvider router={router} />
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

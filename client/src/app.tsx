import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './app/welcome/welcome';
import DashboardLayout from './app/dashboard/layout';
import ErrorPage from './components/error-page';
import AuthProvider from './components/auth-provider';
import AuthRoute from './components/auth-route';
import NoAuthRoute from './components/no-auth-route';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;

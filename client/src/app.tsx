import { createBrowserRouter, RouterProvider,} from 'react-router-dom';
import Welcome from './Welcome/Welcome'
import DashboardLayout from './dashboard/layout';
import ErrorPage from './Misc/ErrorPage';
import AuthProvider from './Misc/AuthProvider';
import AuthRoute from './Misc/AuthRoute';
import NoAuthRoute from './Misc/NoAuthRoute';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const router = createBrowserRouter([
  {
    path: "/",
    element:
    <NoAuthRoute>
      <Welcome />
    </NoAuthRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element:
    <AuthRoute>
      <DashboardLayout />
    </AuthRoute>
  }
]);

const queryClient = new QueryClient()

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

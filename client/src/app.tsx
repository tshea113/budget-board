import { createBrowserRouter, RouterProvider,} from 'react-router-dom';
import Welcome from './Welcome/Welcome'
import DashboardLayout from './dashboard/layout';
import ErrorPage from './Misc/ErrorPage';
import AuthProvider from './Misc/AuthProvider';
import AuthRoute from './Misc/AuthRoute';
import NoAuthRoute from './Misc/NoAuthRoute';

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

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App

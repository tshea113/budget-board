import { createBrowserRouter, RouterProvider,} from 'react-router-dom';
import Welcome from './Welcome/Welcome'
import Dashboard from './Dashboard/Dashboard';
import ErrorPage from './Misc/ErrorPage';
import AuthProvider from './Misc/AuthProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />
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

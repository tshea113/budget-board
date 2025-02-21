/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useContext } from 'react';
import { AuthContext } from './auth-provider';
import { Navigate } from 'react-router-dom';
import PageLoading from './page-loading';

interface AuthRouteProps {
  children?: React.ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps): React.ReactNode => {
  const { accessToken, loading } = useContext<any>(AuthContext);

  if (loading) {
    return <PageLoading />;
  }

  if (accessToken) {
    return children;
  }
  return <Navigate to="/" />;
};

export default AuthRoute;

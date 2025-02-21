/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useContext } from 'react';
import { AuthContext } from './auth-provider';
import { Navigate } from 'react-router-dom';
import PageLoading from './page-loading';

interface NoAuthRouteProps {
  children?: React.ReactNode;
}

const NoAuthRoute = ({ children }: NoAuthRouteProps): React.ReactNode => {
  const { accessToken, loading } = useContext<any>(AuthContext);

  if (loading) {
    return <PageLoading />;
  }

  if (!accessToken) {
    return children;
  }

  return <Navigate to="/dashboard" />;
};

export default NoAuthRoute;

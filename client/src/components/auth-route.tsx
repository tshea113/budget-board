/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useContext } from 'react';
import { AuthContext } from './auth-provider';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import PageLoading from './page-loading';

const AuthRoute = ({ children }: { children: any }): JSX.Element => {
  const { accessToken, loading } = useContext<any>(AuthContext);

  if (loading) {
    return <PageLoading />;
  }

  if (accessToken) {
    return children;
  }
  return <Navigate to="/" />;
};

AuthRoute.propTypes = {
  children: PropTypes.node,
};

export default AuthRoute;

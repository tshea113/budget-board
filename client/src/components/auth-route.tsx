/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useContext } from 'react';
import { AuthContext } from './auth-provider';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }: { children: any }): JSX.Element => {
  const { loading, user } = useContext<any>(AuthContext);

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (user) {
    return children;
  }

  return <Navigate to="/" />;
};

AuthRoute.propTypes = {
  children: PropTypes.node,
};

export default AuthRoute;

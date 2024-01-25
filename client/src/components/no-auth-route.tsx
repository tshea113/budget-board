import { useContext } from 'react';
import { AuthContext } from './auth-provider';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const NoAuthRoute = ({ children }: { children: any }): JSX.Element => {
  const { loading, user } = useContext<any>(AuthContext);

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (user === null) {
    return children;
  }

  return <Navigate to="/dashboard" />;
};

NoAuthRoute.propTypes = {
  children: PropTypes.node,
};

export default NoAuthRoute;

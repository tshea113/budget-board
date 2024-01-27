import { useContext } from 'react';
import { AuthContext } from './auth-provider';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const NoAuthRoute = ({ children }: { children: any }): JSX.Element => {
  const { user } = useContext<any>(AuthContext);

  if (user === null) {
    return children;
  }

  return <Navigate to="/dashboard" />;
};

NoAuthRoute.propTypes = {
  children: PropTypes.node,
};

export default NoAuthRoute;

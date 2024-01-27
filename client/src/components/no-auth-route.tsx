import { useContext } from 'react';
import { AuthContext } from './auth-provider';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const NoAuthRoute = ({ children }: { children: any }): JSX.Element => {
  const { currentUserState, loading } = useContext<any>(AuthContext);

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (loading) {
    // TODO: Create a better loading screen
    return <p>Loading...</p>;
  }
  if (currentUserState === null) {
    return children;
  } else {
    return <Navigate to="/dashboard" />;
  }
};

NoAuthRoute.propTypes = {
  children: PropTypes.node,
};

export default NoAuthRoute;

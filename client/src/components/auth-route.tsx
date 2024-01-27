/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useContext } from 'react';
import { AuthContext } from './auth-provider';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }: { children: any }): JSX.Element => {
  const { user } = useContext<any>(AuthContext);

  if (user !== null) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

AuthRoute.propTypes = {
  children: PropTypes.node,
};

export default AuthRoute;

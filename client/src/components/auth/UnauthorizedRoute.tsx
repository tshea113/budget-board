import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router";

interface UnauthorizedRouteProps {
  children: React.ReactNode;
}

const UnauthorizedRoute = (props: UnauthorizedRouteProps): React.ReactNode => {
  const { accessToken, loading } = useContext<any>(AuthContext);

  // TODO: Add a loading spinner here
  if (loading) {
    return <p>Loading</p>;
  }

  if (!accessToken) {
    return props.children;
  }

  return <Navigate to="/dashboard" />;
};

export default UnauthorizedRoute;

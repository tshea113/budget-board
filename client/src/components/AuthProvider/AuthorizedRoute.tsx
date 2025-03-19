import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router";
import { Center, Loader } from "@mantine/core";

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthorizedRoute = (props: AuthRouteProps): React.ReactNode => {
  const { accessToken, loading } = useContext<any>(AuthContext);

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size={100} />
      </Center>
    );
  }

  if (accessToken) {
    return props.children;
  }

  return <Navigate to="/" />;
};

export default AuthorizedRoute;

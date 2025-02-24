import "./App.css";
import "@mantine/core/styles.css";

import { BrowserRouter, Route, Routes } from "react-router";
import { Center, createTheme, MantineProvider } from "@mantine/core";
import Authorized from "./app/authorized/authorized";
import Welcome from "./app/unauthorized/Welcome";
import AuthProvider from "./components/auth/AuthProvider";
import AuthorizedRoute from "./components/auth/AuthorizedRoute";
import UnauthorizedRoute from "./components/auth/UnauthorizedRoute";

// Your theme configuration is merged with default theme
const theme = createTheme({
  fontFamily: "Montserrat, sans-serif",
  defaultRadius: "sm",
  primaryColor: "indigo",
  primaryShade: 3,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AuthProvider>
        <Center>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <UnauthorizedRoute>
                    <Welcome />
                  </UnauthorizedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AuthorizedRoute>
                    <Authorized />
                  </AuthorizedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </Center>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;

import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/notifications/styles.layer.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";

import { BrowserRouter, Route, Routes } from "react-router";
import { Center, createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";

import Welcome from "~/app/Unauthorized/Welcome";
import AuthProvider from "~/components/AuthProvider/AuthProvider";
import AuthorizedRoute from "~/components/AuthProvider/AuthorizedRoute";
import UnauthorizedRoute from "~/components/AuthProvider/UnauthorizedRoute";
import Authorized from "~/app/Authorized/Authorized";

// Your theme configuration is merged with default theme
const theme = createTheme({
  defaultRadius: "xs",
  primaryColor: "indigo",
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
        <QueryClientProvider client={queryClient}>
          <Notifications />
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
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;

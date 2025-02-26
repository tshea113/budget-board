import { AppShell, AppShellNavbar } from "@mantine/core";
import Navbar from "./Navbar/Navbar";
import React from "react";
import PageContent, { Pages } from "./PageContent/PageContent";

const Authorized = (): React.ReactNode => {
  const [currentPage, setCurrentPage] = React.useState(Pages.Dashboard);

  return (
    <AppShell>
      <AppShellNavbar>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </AppShellNavbar>
      <PageContent currentPage={currentPage} />
    </AppShell>
  );
};

export default Authorized;

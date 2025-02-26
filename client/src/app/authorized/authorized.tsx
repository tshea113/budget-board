import classes from "./Authorized.module.css";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
} from "@mantine/core";
import Navbar from "./Navbar/Navbar";
import React from "react";
import PageContent, { Pages } from "./PageContent/PageContent";
import Header from "./Header/Header";
import { useDisclosure } from "@mantine/hooks";

const Authorized = (): React.ReactNode => {
  const [currentPage, setCurrentPage] = React.useState(Pages.Dashboard);
  const [isNavbarOpen, { toggle }] = useDisclosure();

  const onPageSelect = (page: Pages): void => {
    setCurrentPage(page);
    toggle();
  };

  return (
    <AppShell
      className={classes.appShell}
      layout="alt"
      withBorder
      navbar={{
        width: 60,
        breakpoint: "xs",
        collapsed: { mobile: !isNavbarOpen },
      }}
      header={{
        height: 60,
      }}
    >
      <AppShellHeader className={classes.header}>
        <Header isNavbarOpen={isNavbarOpen} toggleNavbar={toggle} />
      </AppShellHeader>
      <AppShellNavbar className={classes.navbar}>
        <Navbar
          currentPage={currentPage}
          setCurrentPage={onPageSelect}
          isNavbarOpen={isNavbarOpen}
          toggleNavbar={toggle}
        />
      </AppShellNavbar>
      <AppShellMain>
        <PageContent currentPage={currentPage} />
      </AppShellMain>
    </AppShell>
  );
};

export default Authorized;

import classes from "./Settings.module.css";

import { Stack } from "@mantine/core";
import DarkModeToggle from "./DarkModeToggle";
import LinkSimpleFin from "./LinkSimpleFin/LinkSimpleFin";
import React from "react";
import ResetPassword from "./ResetPassword";

const Settings = (): React.ReactNode => {
  return (
    <Stack className={classes.root}>
      <DarkModeToggle />
      <LinkSimpleFin />
      <ResetPassword />
    </Stack>
  );
};

export default Settings;

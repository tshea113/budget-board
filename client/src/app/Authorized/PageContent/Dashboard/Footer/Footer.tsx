import classes from "./Footer.module.css";

import { Group, Text } from "@mantine/core";
import React from "react";

const Footer = (): React.ReactNode => {
  return (
    <Group className={classes.root}>
      <Text size="xs" fw={600}>
        {import.meta.env.VITE_VERSION}
      </Text>
    </Group>
  );
};

export default Footer;

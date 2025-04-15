import classes from "./Footer.module.css";

import { ActionIcon, Group, Text } from "@mantine/core";
import React from "react";
import { SiGithub } from "@icons-pack/react-simple-icons";

const Footer = (): React.ReactNode => {
  return (
    <Group className={classes.root}>
      <Text size="xs" fw={600}>
        {import.meta.env.VITE_VERSION}
      </Text>
      <ActionIcon
        component="a"
        href="https://github.com/teelur/budget-board"
        target="_blank"
        variant="subtle"
        color="var(--mantine-color-text)"
      >
        <SiGithub />
      </ActionIcon>
    </Group>
  );
};

export default Footer;

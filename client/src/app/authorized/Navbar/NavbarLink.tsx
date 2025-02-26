import { Tooltip, UnstyledButton } from "@mantine/core";

import classes from "./Navbar.module.css";

interface NavbarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavbarLink = (props: NavbarLinkProps): React.ReactNode => {
  return (
    <Tooltip
      label={props.label}
      position="right"
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        onClick={props.onClick}
        className={classes.link}
        data-active={props.active || undefined}
      >
        {props.icon}
      </UnstyledButton>
    </Tooltip>
  );
};

export default NavbarLink;

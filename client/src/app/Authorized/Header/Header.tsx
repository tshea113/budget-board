import BudgetBoardLogo from "~/assets/budget-board-logo";
import classes from "./Header.module.css";

import { Burger, Flex, Group, useComputedColorScheme } from "@mantine/core";
import SyncButton from "./SyncButton/SyncButton";

interface HeaderProps {
  isNavbarOpen: boolean;
  toggleNavbar: () => void;
}

const Header = (props: HeaderProps): React.ReactNode => {
  const computedColorScheme = useComputedColorScheme();
  return (
    <Group className={classes.header}>
      <Flex className={classes.logo}>
        <Burger
          opened={props.isNavbarOpen}
          className={classes.burger}
          onClick={props.toggleNavbar}
          hiddenFrom="xs"
          size="md"
        />
        <BudgetBoardLogo
          height={40}
          darkMode={computedColorScheme === "dark"}
        />
      </Flex>
      <Flex className={classes.syncButton}>
        <SyncButton />
      </Flex>
    </Group>
  );
};

export default Header;

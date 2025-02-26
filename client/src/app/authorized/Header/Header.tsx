import BudgetBoardLogo from "../../../assets/budget-board-logo";
import classes from "./Header.module.css";

import { Burger, Group } from "@mantine/core";

interface HeaderProps {
  isNavbarOpen: boolean;
  toggleNavbar: () => void;
}

const Header = (props: HeaderProps): React.ReactNode => {
  return (
    <Group align="center" className={classes.header}>
      <Burger
        opened={props.isNavbarOpen}
        className={classes.burger}
        onClick={props.toggleNavbar}
        hiddenFrom="xs"
        size="md"
      />
      <BudgetBoardLogo height={40} darkMode />
    </Group>
  );
};

export default Header;

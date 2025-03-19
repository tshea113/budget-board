import classes from "./UnbudgetedGroupControl.module.css";

import { convertNumberToCurrency } from "$helpers/currency";
import { Group, Text } from "@mantine/core";

interface UnbudgetedGroupControlProps {
  total: number;
}

const UnbudgetedGroupControl = (props: UnbudgetedGroupControlProps) => {
  return (
    <Group className={classes.root}>
      <Group className={classes.labelContainer}>
        <Text className={classes.text}>Unbudgeted</Text>
      </Group>
      <Group className={classes.dataContainer}>
        <Group className={classes.amountContainer}>
          <Text className={classes.text}>
            {convertNumberToCurrency(props.total)}
          </Text>
        </Group>
        <Group className={classes.spacer} />
      </Group>
    </Group>
  );
};

export default UnbudgetedGroupControl;

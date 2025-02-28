import classes from "./DeletedAccountCard.module.css";

import { getDaysSinceDate } from "@helpers/datetime";
import { Button, Card, Group, Text } from "@mantine/core";
import { IAccount } from "@models/account";
import { Undo2Icon } from "lucide-react";

interface DeletedAccountCardProps {
  deletedAccount: IAccount;
}

const DeletedAccountCard = (
  props: DeletedAccountCardProps
): React.ReactNode => {
  return (
    <Card className={classes.card} shadow="xs" radius="lg">
      <Text className={classes.column}>{props.deletedAccount.name}</Text>
      <Text className={classes.column}>
        {`${getDaysSinceDate(props.deletedAccount.deleted)} days since deleted`}
      </Text>
      <Group className={classes.button}>
        <Button>
          <Undo2Icon size={16} />
        </Button>
      </Group>
    </Card>
  );
};

export default DeletedAccountCard;

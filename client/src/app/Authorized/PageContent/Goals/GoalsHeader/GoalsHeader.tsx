import classes from "./GoalsHeader.module.css";

import { ActionIcon, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PlusIcon } from "lucide-react";
import React from "react";
import AddGoalModal from "./AddGoalModal/AddGoalModal";

interface GoalsHeaderProps {
  includeInterest: boolean;
  toggleIncludeInterest: () => void;
}

const GoalsHeader = (props: GoalsHeaderProps): React.ReactNode => {
  const [isOpen, { toggle }] = useDisclosure();

  return (
    <Group className={classes.root}>
      <AddGoalModal isOpen={isOpen} onClose={toggle} />
      <Button
        variant="outline"
        color={props.includeInterest ? "green" : "red"}
        onClick={props.toggleIncludeInterest}
      >
        Include Interest
      </Button>
      <ActionIcon size="input-sm" onClick={toggle}>
        <PlusIcon />
      </ActionIcon>
    </Group>
  );
};

export default GoalsHeader;

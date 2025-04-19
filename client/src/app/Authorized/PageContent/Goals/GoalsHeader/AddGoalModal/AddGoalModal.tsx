import { Modal, Select } from "@mantine/core";
import { GoalType } from "~/models/goal";
import React from "react";
import SaveGoalForm from "./SaveGoalForm/SaveGoalForm";
import PayGoalForm from "./PayGoalForm/PayGoalForm";

const goalTypes: { label: string; value: string }[] = [
  { label: "Grow my funds", value: GoalType.SaveGoal },
  { label: "Pay off debt", value: GoalType.PayGoal },
];

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGoalModal = (props: AddGoalModalProps): React.ReactNode => {
  const [selectedGoalType, setSelectedGoalType] = React.useState<string | null>(
    null
  );
  return (
    <Modal
      opened={props.isOpen}
      onClose={props.onClose}
      title="Add Goal"
      styles={{
        inner: {
          left: "0",
          right: "0",
          padding: "0 !important",
        },
      }}
    >
      <Select
        data={goalTypes}
        placeholder="I want to set a goal to..."
        value={selectedGoalType}
        onChange={(value) => setSelectedGoalType(value)}
      />
      {selectedGoalType === GoalType.SaveGoal && <SaveGoalForm />}
      {selectedGoalType === GoalType.PayGoal && <PayGoalForm />}
    </Modal>
  );
};

export default AddGoalModal;

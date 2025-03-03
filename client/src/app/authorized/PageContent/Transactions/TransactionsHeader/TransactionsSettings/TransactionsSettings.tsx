import { Accordion, Modal } from "@mantine/core";
import React from "react";
import CustomCategories from "./CustomCategories/CustomCategories";

interface TransactionsSettingsProps {
  modalOpened: boolean;
  closeModal: () => void;
}

const TransactionsSettings = (
  props: TransactionsSettingsProps
): React.ReactNode => {
  return (
    <Modal
      size="40rem"
      centered
      opened={props.modalOpened}
      onClose={props.closeModal}
      title="Transactions Settings"
    >
      <Accordion variant="filled">
        <Accordion.Item value="custom categories">
          <Accordion.Control>Custom Categories</Accordion.Control>
          <Accordion.Panel>
            <CustomCategories />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="deleted transactions">
          <Accordion.Control>Deleted Transactions</Accordion.Control>
          <Accordion.Panel>
            <p>Deleted transactions</p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  );
};

export default TransactionsSettings;

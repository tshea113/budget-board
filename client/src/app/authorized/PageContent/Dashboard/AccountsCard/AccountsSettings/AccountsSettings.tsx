import { Modal } from "@mantine/core";
import React from "react";
import DeletedAccounts from "./DeletedAccounts";
import { IAccount } from "@models/account";

interface AccountsSettingsProps {
  modalOpened: boolean;
  closeModal: () => void;
  accounts: IAccount[];
}

const AccountsSettings = (props: AccountsSettingsProps): React.ReactNode => {
  return (
    <Modal
      size="55rem"
      centered
      opened={props.modalOpened}
      onClose={props.closeModal}
      title="Accounts Settings"
    >
      <DeletedAccounts
        deletedAccounts={props.accounts.filter(
          (a: IAccount) => a.deleted !== null
        )}
      />
    </Modal>
  );
};

export default AccountsSettings;

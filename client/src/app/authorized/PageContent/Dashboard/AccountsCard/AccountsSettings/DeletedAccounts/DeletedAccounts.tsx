import { Accordion, Stack } from "@mantine/core";
import { IAccount } from "$/models/account";
import React from "react";
import DeletedAccountCard from "./DeletedAccountCard/DeletedAccountCard";

interface DeletedAccountsProps {
  deletedAccounts: IAccount[];
}

const DeletedAccounts = (props: DeletedAccountsProps): React.ReactNode => {
  return (
    <Accordion variant="filled">
      <Accordion.Item value="deleted-account">
        <Accordion.Control>Deleted Accounts</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            {props.deletedAccounts.map((deletedAccount) => (
              <DeletedAccountCard
                key={deletedAccount.id}
                deletedAccount={deletedAccount}
              />
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default DeletedAccounts;

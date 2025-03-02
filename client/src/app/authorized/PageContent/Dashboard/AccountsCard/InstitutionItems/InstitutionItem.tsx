import classes from "./InstitutionItem.module.css";

import { filterVisibleAccounts } from "@helpers/accounts";
import { Card, Divider, Stack, Title } from "@mantine/core";
import { IAccount } from "@models/account";
import { IInstitution } from "@models/institution";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import React from "react";
import AccountItem from "./AccountItem/AccountItem";

interface InstitutionItemProps {
  institution: IInstitution;
}

const InstitutionItem = (props: InstitutionItemProps): React.ReactNode => {
  const sortedFilteredAccounts = filterVisibleAccounts(
    props.institution.accounts
  ).sort((a, b) => a.index - b.index);

  return (
    <Card className={classes.card} radius="lg" padding="sm" shadow="none">
      <Stack gap={0.5}>
        <Title order={4}>{props.institution.name}</Title>
        <Divider mb="xs" size="sm" />
      </Stack>
      <Stack gap={1}>
        <DndContext>
          <SortableContext items={sortedFilteredAccounts}>
            {sortedFilteredAccounts.map((account: IAccount) => (
              <AccountItem key={account.id} account={account} />
            ))}
          </SortableContext>
        </DndContext>
      </Stack>
    </Card>
  );
};

export default InstitutionItem;

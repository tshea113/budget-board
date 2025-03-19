import classes from "./AccountsCard.module.css";

import {
  ActionIcon,
  Card,
  Group,
  Skeleton,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { SettingsIcon } from "lucide-react";
import React from "react";
import { AuthContext } from "~/components/AuthProvider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { IInstitution } from "~/models/institution";
import InstitutionItem from "./InstitutionItems/InstitutionItem";
import AccountsSettings from "./AccountsSettings/AccountsSettings";
import { useDisclosure } from "@mantine/hooks";
import { IAccount } from "~/models/account";

const AccountsCard = (): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);
  const institutionQuery = useQuery({
    queryKey: ["institutions"],
    queryFn: async (): Promise<IInstitution[]> => {
      const res: AxiosResponse = await request({
        url: "/api/institution",
        method: "GET",
      });

      if (res.status === 200) {
        return res.data as IInstitution[];
      }

      return [];
    },
  });

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<IAccount[]> => {
      const res: AxiosResponse = await request({
        url: "/api/account",
        method: "GET",
      });

      if (res.status === 200) {
        return res.data as IAccount[];
      }

      return [];
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  const sortedInstitutions = institutionQuery.data?.sort(
    (a, b) => a.index - b.index
  );

  return (
    <Card
      className={classes.card}
      padding="xs"
      radius="md"
      shadow="sm"
      withBorder
    >
      <Group className={classes.headerContainer}>
        <Title order={2}>Accounts</Title>
        <ActionIcon
          className={classes.settingsIcon}
          variant="subtle"
          onClick={open}
        >
          <SettingsIcon />
        </ActionIcon>
        <AccountsSettings
          modalOpened={opened}
          closeModal={close}
          institutions={institutionQuery.data ?? []}
          accounts={accountsQuery.data ?? []}
        />
      </Group>
      <Stack className={classes.accountsContainer}>
        {institutionQuery.isPending || accountsQuery.isPending ? (
          <Skeleton height={600} radius="lg" />
        ) : (sortedInstitutions ?? []).length > 0 ? (
          (sortedInstitutions ?? []).map((institution: IInstitution) => (
            <InstitutionItem key={institution.id} institution={institution} />
          ))
        ) : (
          <Text>No accounts found</Text>
        )}
      </Stack>
    </Card>
  );
};

export default AccountsCard;

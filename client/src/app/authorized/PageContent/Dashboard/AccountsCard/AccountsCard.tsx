import classes from "./AccountsCard.module.css";

import { ActionIcon, Card, Group, Stack, Title } from "@mantine/core";
import { SettingsIcon } from "lucide-react";
import React from "react";
import { AuthContext } from "@components/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { IInstitution } from "@models/institution";
import InstitutionItem from "./InstitutionItems/InstitutionItem";

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

  const sortedInstitutions = institutionQuery.data?.sort(
    (a, b) => a.index - b.index
  );

  return (
    <Card
      className={classes.card}
      padding="sm"
      radius="md"
      shadow="sm"
      withBorder
    >
      <Group justify="space-between" align="center">
        <Title order={2}>Accounts</Title>
        <ActionIcon className={classes.settingsIcon} variant="subtle">
          <SettingsIcon />
        </ActionIcon>
      </Group>
      <Stack gap={5}>
        {(sortedInstitutions ?? []).map((institution: IInstitution) => (
          <InstitutionItem key={institution.id} institution={institution} />
        ))}
      </Stack>
    </Card>
  );
};

export default AccountsCard;

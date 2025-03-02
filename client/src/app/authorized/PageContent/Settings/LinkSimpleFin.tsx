import classes from "./Settings.module.css";

import {
  Button,
  Card,
  CardSection,
  Title,
  Badge,
  Group,
  LoadingOverlay,
  PasswordInput,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AuthContext } from "@components/Auth/AuthProvider";
import { IApplicationUser } from "@models/applicationUser";
import { AxiosError, AxiosResponse } from "axios";
import { translateAxiosError } from "@helpers/requests";
import { notifications } from "@mantine/notifications";
import { isNotEmpty, useForm } from "@mantine/form";

const LinkSimpleFin = (): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<IApplicationUser | undefined> => {
      const res: AxiosResponse = await request({
        url: "/api/applicationUser",
        method: "GET",
      });

      if (res.status === 200) {
        return res.data as IApplicationUser;
      }

      return undefined;
    },
  });

  const queryClient = useQueryClient();
  const doSetAccessToken = useMutation({
    mutationFn: async (setupToken: string) =>
      await request({
        url: "/api/simplefin/updateAccessToken",
        method: "PUT",
        params: { setupToken },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      notifications.show({
        color: "green",
        message: "SimpleFin account linked!",
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        color: "red",
        message: translateAxiosError(error),
      });
    },
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { simpleFinKey: "" },
    validate: {
      simpleFinKey: isNotEmpty("SimpleFin key is required"),
    },
  });

  return (
    <Card className={classes.card} withBorder radius="md" shadow="sm">
      <CardSection>
        <Group>
          <Title order={3}>Link SimpleFIN</Title>
          {userQuery.data?.accessToken && (
            <Badge color="green" maw={80}>
              Linked
            </Badge>
          )}
        </Group>
      </CardSection>
      <CardSection className={classes.cardSection}>
        <LoadingOverlay visible={doSetAccessToken.isPending} zIndex={1000} />
        <form
          className={classes.form}
          style={{ width: "100%" }}
          onSubmit={form.onSubmit((values) =>
            doSetAccessToken.mutate(values.simpleFinKey)
          )}
        >
          <PasswordInput
            {...form.getInputProps("simpleFinKey")}
            key={form.key("simpleFinKey")}
            label="SimpleFIN Key"
            w="100%"
          />
          <Button type="submit">Save Changes</Button>
        </form>
      </CardSection>
    </Card>
  );
};

export default LinkSimpleFin;

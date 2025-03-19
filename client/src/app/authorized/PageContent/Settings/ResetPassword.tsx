import { hasLength, useForm } from "@mantine/form";
import classes from "./Settings.module.css";

import {
  Button,
  Card,
  CardSection,
  LoadingOverlay,
  PasswordInput,
  Title,
} from "@mantine/core";
import React from "react";
import { AuthContext } from "$/components/Auth/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { translateAxiosError, ValidationError } from "$/helpers/requests";
import { AxiosError } from "axios";

type ResetPasswordData = {
  oldPassword: string;
  newPassword: string;
};

const ResetPassword = (): React.ReactNode => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
    validate: {
      oldPassword: hasLength(
        {
          min: 3,
        },
        "Password must be at least 3 characters."
      ),
      newPassword: hasLength(
        {
          min: 3,
        },
        "Password must be at least 3 characters."
      ),
      confirmNewPassword: (value, values) =>
        value !== values.newPassword ? "Passwords did not match" : null,
    },
  });

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doResetPassword = useMutation({
    mutationFn: async (resetPasswordData: ResetPasswordData) =>
      await request({
        url: "/api/manage/info",
        method: "POST",
        data: {
          newPassword: resetPasswordData.newPassword,
          oldPassword: resetPasswordData.oldPassword,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      notifications.show({
        color: "green",
        message: "Password successfully updated.",
      });
    },
    onError: (error: AxiosError) => {
      if (error?.response?.data) {
        const errorData = error.response.data as ValidationError;
        if (
          error.status === 400 &&
          errorData.title === "One or more validation errors occurred."
        ) {
          notifications.show({
            title: "One or more validation errors occurred.",
            color: "red",
            message: Object.values(errorData.errors).join("\n"),
          });
        }
      } else {
        notifications.show({
          color: "red",
          message: translateAxiosError(error),
        });
      }
    },
  });

  return (
    <Card className={classes.card} withBorder radius="md" shadow="sm">
      <CardSection>
        <Title order={3}>Reset Password</Title>
      </CardSection>
      <CardSection className={classes.cardSection}>
        <LoadingOverlay visible={doResetPassword.isPending} />
        <form
          className={classes.form}
          style={{ width: "100%" }}
          onSubmit={form.onSubmit((values) =>
            doResetPassword.mutate({
              oldPassword: values.oldPassword,
              newPassword: values.newPassword,
            })
          )}
        >
          <PasswordInput
            {...form.getInputProps("oldPassword")}
            key={form.key("oldPassword")}
            label="Current Password"
            w="100%"
          />
          <PasswordInput
            {...form.getInputProps("newPassword")}
            key={form.key("newPassword")}
            label="New Password"
            w="100%"
          />
          <PasswordInput
            {...form.getInputProps("confirmNewPassword")}
            key={form.key("confirmNewPassword")}
            label="Confirm Password"
            w="100%"
          />
          <Button type="submit">Submit</Button>
        </form>
      </CardSection>
    </Card>
  );
};

export default ResetPassword;

import { Stack, TextInput, PasswordInput, Button } from "@mantine/core";
import { useForm, hasLength, isNotEmpty } from "@mantine/form";
import React from "react";
import { LoginCardState } from "./Welcome";

import classes from "./Welcome.module.css";

interface ResetPasswordProps {
  setLoginCardState: React.Dispatch<React.SetStateAction<LoginCardState>>;
}

const ResetPassword = (props: ResetPasswordProps): React.ReactNode => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { resetCode: "", password: "", confirmPassword: "" },
    validate: {
      resetCode: isNotEmpty("Reset code is required"),
      password: hasLength({ min: 3 }, "Must be at least 3 characters"),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const [_, setSubmittedValues] = React.useState<typeof form.values | null>(
    null
  );

  return (
    <Stack gap="md" align="center">
      <form
        className={classes.form}
        style={{ width: "100%" }}
        onSubmit={form.onSubmit(setSubmittedValues)}
      >
        <TextInput
          {...form.getInputProps("resetCode")}
          key={form.key("resetCode")}
          label="Reset Code"
          w="100%"
        />
        <PasswordInput
          {...form.getInputProps("password")}
          key={form.key("password")}
          label="Password"
          w="100%"
        />
        <PasswordInput
          {...form.getInputProps("confirmPassword")}
          key={form.key("confirmPassword")}
          label="Confirm Password"
          w="100%"
        />
        <Button variant="filled" fullWidth type="submit">
          Reset Password
        </Button>
      </form>
      <Button
        variant="default"
        fullWidth
        onClick={() => props.setLoginCardState(LoginCardState.Login)}
      >
        Return to Login
      </Button>
    </Stack>
  );
};

export default ResetPassword;

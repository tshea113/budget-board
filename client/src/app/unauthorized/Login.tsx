import { Anchor, Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import React from "react";
import classes from "./Welcome.module.css";
import { LoginCardState } from "./Welcome";

interface LoginProps {
  setLoginCardState: React.Dispatch<React.SetStateAction<LoginCardState>>;
}

const Login = (props: LoginProps): React.ReactNode => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength({ min: 3 }, "Must be at least 3 characters"),
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
          {...form.getInputProps("email")}
          key={form.key("email")}
          label="Email"
          w="100%"
        />
        <PasswordInput
          {...form.getInputProps("password")}
          key={form.key("password")}
          label="Password"
          w="100%"
        />
        <Button variant="filled" fullWidth type="submit">
          Login
        </Button>
      </form>
      <Anchor
        size="sm"
        onClick={() => props.setLoginCardState(LoginCardState.ResetPassword)}
      >
        Reset Password
      </Anchor>
    </Stack>
  );
};

export default Login;

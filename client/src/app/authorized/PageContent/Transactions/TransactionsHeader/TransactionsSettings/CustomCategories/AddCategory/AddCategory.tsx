import { AuthContext } from "@components/Auth/AuthProvider";
import { translateAxiosError } from "@helpers/requests";
import { Button, Card, LoadingOverlay, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ICategoryCreateRequest } from "@models/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";

const AddCategory = (): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doAddCategory = useMutation({
    mutationFn: async (category: ICategoryCreateRequest) =>
      await request({
        url: "/api/transactionCategory",
        method: "POST",
        data: category,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["transactionCategories"] });
      notifications.show({ color: "green", message: "Category added!" });
    },
    onError: (error: AxiosError) =>
      notifications.show({ color: "red", message: translateAxiosError(error) }),
  });

  const form = useForm({
    mode: "controlled",
    initialValues: { name: "", parent: "" },
    validate: {
      name: isNotEmpty("Name is required"),
      parent: isNotEmpty("Parent is required"),
    },
  });

  return (
    <Card withBorder shadow="xs">
      <LoadingOverlay visible={doAddCategory.isPending} />
      <form
        style={{ width: "100%" }}
        onSubmit={form.onSubmit((values: { name: string; parent: string }) => {
          doAddCategory.mutate({ value: values.name, parent: values.parent });
        })}
      >
        <Stack>
          <TextInput
            {...form.getInputProps("name")}
            key={form.key("name")}
            label="Category Name"
            w="100%"
          />
          {/* TODO: Create a category select input */}
          <TextInput
            {...form.getInputProps("parent")}
            key={form.key("parent")}
            label="Parent Category"
            w="100%"
          />
          <Button w="100%" type="submit">
            Add Category
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default AddCategory;

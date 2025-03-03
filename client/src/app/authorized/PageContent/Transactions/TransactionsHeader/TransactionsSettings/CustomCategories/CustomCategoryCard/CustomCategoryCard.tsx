import { AuthContext } from "@components/Auth/AuthProvider";
import classes from "./CustomCategoryCard.module.css";

import { ActionIcon, Card, Group, LoadingOverlay, Text } from "@mantine/core";
import { ICategoryResponse } from "@models/category";
import { TrashIcon } from "lucide-react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { translateAxiosError } from "@helpers/requests";

interface CustomCategoryCardProps {
  category: ICategoryResponse;
}

const CustomCategoryCard = (
  props: CustomCategoryCardProps
): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);
  const queryClient = useQueryClient();
  const doDeleteCategory = useMutation({
    mutationFn: async (guid: string) =>
      await request({
        url: "/api/transactionCategory",
        method: "DELETE",
        params: { guid },
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["transactionCategories"] });
      notifications.show({ color: "green", message: "Category deleted!" });
    },
    onError: (error: AxiosError) =>
      notifications.show({ color: "red", message: translateAxiosError(error) }),
  });

  return (
    <Card className={classes.card} shadow="xs" padding="md" radius="md">
      <LoadingOverlay visible={doDeleteCategory.isPending} />
      <Group className={classes.group}>
        <Text>{props.category.value}</Text>
        <Text>{props.category.parent}</Text>
        <ActionIcon onClick={() => doDeleteCategory.mutate(props.category.id)}>
          <TrashIcon />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default CustomCategoryCard;

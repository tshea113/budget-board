import classes from "./CustomCategoryCard.module.css";
import parentClasses from "../CustomCategories.module.css";

import {
  ActionIcon,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { ICategoryResponse } from "~/models/category";
import { TrashIcon } from "lucide-react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { translateAxiosError } from "~/helpers/requests";
import { AuthContext } from "~/components/Auth/AuthProvider";

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
        <Flex className={parentClasses.nameContainer}>
          <Text>{props.category.value}</Text>
        </Flex>
        <Flex className={parentClasses.parentContainer}>
          <Text>{props.category.parent}</Text>
        </Flex>
        <Flex className={parentClasses.deleteContainer}>
          <ActionIcon
            onClick={() => doDeleteCategory.mutate(props.category.id)}
          >
            <TrashIcon size="1.2rem" />
          </ActionIcon>
        </Flex>
      </Group>
    </Card>
  );
};

export default CustomCategoryCard;

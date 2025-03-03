import { Group, Stack, Text } from "@mantine/core";
import React from "react";
import AddCategory from "./AddCategory/AddCategory";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { ICategoryResponse } from "@models/category";
import CustomCategoryCard from "./CustomCategoryCard/CustomCategoryCard";

const CustomCategories = (): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);
  const transactionCategoriesQuery = useQuery({
    queryKey: ["transactionCategories"],
    queryFn: async () => {
      const res = await request({
        url: "/api/transactionCategory",
        method: "GET",
      });

      if (res.status === 200) {
        return res.data as ICategoryResponse[];
      }

      return undefined;
    },
  });

  return (
    <Stack>
      <AddCategory />
      <Stack>
        <Group px="0.5rem" justify="space-between">
          <Text fw={600}>Name</Text>
          <Text fw={600}>Parent</Text>
          <Text w="2.5rem" />
        </Group>
        {(transactionCategoriesQuery.data ?? []).length > 0 ? (
          transactionCategoriesQuery.data?.map(
            (category: ICategoryResponse) => (
              <CustomCategoryCard key={category.id} category={category} />
            )
          )
        ) : (
          <Text>No custom categories.</Text>
        )}
      </Stack>
    </Stack>
  );
};

export default CustomCategories;

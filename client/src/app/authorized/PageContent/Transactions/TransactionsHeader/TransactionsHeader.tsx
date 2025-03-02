import classes from "./TransactionsHeader.module.css";

import { ActionIcon, Button, Flex, Group, Stack } from "@mantine/core";
import { FilterIcon, SettingsIcon } from "lucide-react";
import React from "react";
import SortMenu from "./SortMenu/SortMenu";
import { SortDirection } from "@components/SortButton";
import { Filters } from "@models/transaction";
import { Sorts } from "./SortMenu/SortMenuHelpers";
import FilterCard from "./FilterCard/FilterCard";
import { useDisclosure } from "@mantine/hooks";

interface TransactionsHeaderProps {
  sort: Sorts;
  setSort: (newSort: Sorts) => void;
  sortDirection: SortDirection;
  setSortDirection: (newSortDirection: SortDirection) => void;
  filters: Filters;
  setFilters: (newFilters: Filters) => void;
}

const TransactionsHeader = (
  props: TransactionsHeaderProps
): React.ReactNode => {
  const [isFilterCardOpen, { toggle }] = useDisclosure();

  return (
    <Stack className={classes.root}>
      <Flex className={classes.header}>
        <SortMenu
          currentSort={props.sort}
          setCurrentSort={props.setSort}
          sortDirection={props.sortDirection}
          setSortDirection={props.setSortDirection}
        />
        <Group>
          <Button
            size="sm"
            rightSection={<FilterIcon size="1rem" />}
            onClick={toggle}
          >
            Filter
          </Button>
          <ActionIcon size="input-sm">
            <SettingsIcon />
          </ActionIcon>
        </Group>
      </Flex>
      <FilterCard
        isOpen={isFilterCardOpen}
        filters={props.filters}
        setFilters={props.setFilters}
      />
    </Stack>
  );
};

export default TransactionsHeader;

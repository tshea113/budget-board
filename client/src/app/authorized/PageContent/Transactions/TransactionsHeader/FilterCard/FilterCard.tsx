import CategorySelect from "@components/CategorySelect";
import classes from "./FilterCard.module.css";

import AccountSelectInput from "@components/AccountSelectInput";
import { Card, Flex, Stack, Title, useCombobox } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Filters } from "@models/transaction";
import React from "react";

interface FilterCardProps {
  isOpen: boolean;
  filters: Filters;
  setFilters: (newFilters: Filters) => void;
}

const FilterCard = (props: FilterCardProps): React.ReactNode => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <Card radius="md">
      <Stack>
        {/* TODO: Finish the styling on this */}
        <Title order={2}>Filters</Title>
        <Flex
          className={classes.group}
          direction={{ base: "column", sm: "row" }}
          wrap="nowrap"
          gap="md"
        >
          <DatePickerInput
            w="100%"
            type="range"
            label="Dates"
            placeholder="Pick a date range"
            value={props.filters.dateRange}
            onChange={(dateRange: [Date | null, Date | null]) =>
              props.setFilters({
                ...props.filters,
                dateRange,
              })
            }
          />
          <AccountSelectInput
            label="Accounts"
            w="100%"
            selectedAccountIds={props.filters.accounts}
            setSelectedAccountIds={(newAccountIds: string[]) => {
              props.setFilters({
                ...props.filters,
                accounts: newAccountIds,
              });
            }}
            hideHidden
          />
          {/* TODO: Create a category select component */}
          <CategorySelect combobox={useCombobox()} categories={[]} />
        </Flex>
      </Stack>
    </Card>
  );
};

export default FilterCard;

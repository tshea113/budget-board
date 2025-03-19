import MonthToolcards from "$components/MonthToolcards/MonthToolcards";
import { initCurrentMonth } from "$helpers/datetime";
import { Button, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import AddBudget from "./AddBudget/AddBudget";
import { ICategory } from "$models/category";

interface BudgetsToolbarProps {
  categories: ICategory[];
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
  timeToMonthlyTotalsMap: Map<number, number>;
  showCopy: boolean;
  isPending: boolean;
}

const BudgetsToolbar = (props: BudgetsToolbarProps): React.ReactNode => {
  const [canSelectMultiple, { toggle }] = useDisclosure(false);

  const toggleSelectMultiple = () => {
    if (canSelectMultiple) {
      // Need to pick the date used for our single date.
      if (props.selectedDates.length === 0) {
        // When nothing is selected, revert back to today.
        props.setSelectedDates([initCurrentMonth()]);
      } else {
        // Otherwise select the most recent selected date.
        props.setSelectedDates([
          new Date(Math.max(...props.selectedDates.map((d) => d.getTime()))),
        ]);
      }
    }

    toggle();
  };

  return (
    <Stack>
      <Button
        onClick={toggleSelectMultiple}
        variant="outline"
        color={canSelectMultiple ? "green" : "gray"}
      >
        Select Multiple
      </Button>
      <MonthToolcards
        selectedDates={props.selectedDates}
        setSelectedDates={props.setSelectedDates}
        timeToMonthlyTotalsMap={props.timeToMonthlyTotalsMap}
        showCopy={props.showCopy}
        isPending={props.isPending}
        allowSelectMultiple={canSelectMultiple}
      />
      <Group justify="flex-end">
        {props.selectedDates.length === 1 && (
          <AddBudget
            date={props.selectedDates[0]!}
            categories={props.categories}
          />
        )}
      </Group>
    </Stack>
  );
};

export default BudgetsToolbar;

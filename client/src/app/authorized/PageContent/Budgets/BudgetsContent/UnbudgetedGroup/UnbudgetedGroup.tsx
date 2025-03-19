import classes from "./UnbudgetedGroup.module.css";

import { Accordion, Stack } from "@mantine/core";
import React from "react";
import UnbudgetedGroupControl from "./UnbudgetedGroupControl/UnbudgetedGroupControl";
import UnbudgetedCard from "./UnbudgetedCard/UnbudgetedCard";
import { getFormattedCategoryValue } from "$helpers/category";
import { ICategory } from "$models/category";

interface UnbudgetedGroupProps {
  unbudgetedCategoryToTransactionsTotalMap: Map<string, number>;
  categories: ICategory[];
  selectedDate?: Date;
}

const UnbudgetedGroup = (props: UnbudgetedGroupProps): React.ReactNode => {
  const total = Array.from(
    props.unbudgetedCategoryToTransactionsTotalMap.values()
  ).reduce((acc, val) => acc + val, 0);

  return (
    <Accordion variant="separated" radius="md">
      <Accordion.Item
        className={classes.accordion}
        key="unbudgeted"
        value="unbudgeted"
      >
        <Accordion.Control>
          <UnbudgetedGroupControl total={total} />
        </Accordion.Control>
        <Accordion.Panel className={classes.content}>
          <Stack className={classes.unbudgetCards}>
            {Array.from(props.unbudgetedCategoryToTransactionsTotalMap)
              .filter((unbudget) => Math.round(unbudget[1]) !== 0)
              .map(([category, total]) => (
                <UnbudgetedCard
                  key={category}
                  category={getFormattedCategoryValue(
                    category,
                    props.categories
                  )}
                  amount={total}
                  selectedDate={props.selectedDate}
                />
              ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default UnbudgetedGroup;

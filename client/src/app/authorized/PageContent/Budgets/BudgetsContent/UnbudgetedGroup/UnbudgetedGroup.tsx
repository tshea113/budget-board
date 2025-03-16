import { Accordion } from "@mantine/core";
import React from "react";
import UnbudgetedGroupControl from "./UnbudgetedGroupControl/UnbudgetedGroupControl";

interface UnbudgetedGroupProps {
  unbudgetedCategoryToTransactionsTotalMap: Map<string, number>;
}

const UnbudgetedGroup = (props: UnbudgetedGroupProps): React.ReactNode => {
  const total = Array.from(
    props.unbudgetedCategoryToTransactionsTotalMap.values()
  ).reduce((acc, val) => acc + val, 0);

  return (
    <Accordion variant="separated">
      <Accordion.Item key="unbudgeted" value="unbudgeted">
        <Accordion.Control>
          <UnbudgetedGroupControl total={total} />
        </Accordion.Control>
        <Accordion.Panel>Content</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default UnbudgetedGroup;

import { filterBalancesByDateRange } from "~/helpers/balances";
import { BuildNetWorthChartData } from "~/helpers/charts";
import { convertNumberToCurrency } from "~/helpers/currency";
import { getDateFromMonthsAgo } from "~/helpers/datetime";
import { CompositeChart } from "@mantine/charts";
import { Group, Skeleton, Text } from "@mantine/core";
import { DateValue } from "@mantine/dates";
import { IAccount } from "~/models/account";
import { IBalance } from "~/models/balance";
import React from "react";

interface NetWorthChartProps {
  accounts: IAccount[];
  balances: IBalance[];
  dateRange: [DateValue, DateValue];
  isPending?: boolean;
  invertYAxis?: boolean;
}

const NetWorthChart = (props: NetWorthChartProps): React.ReactNode => {
  if (props.isPending) {
    return <Skeleton height={425} radius="lg" />;
  }

  if (props.accounts?.length === 0 || props.balances?.length === 0) {
    return (
      <Group justify="center">
        <Text>Select an account to display the chart.</Text>
      </Group>
    );
  }

  return (
    <CompositeChart
      h={400}
      w="100%"
      data={BuildNetWorthChartData(
        filterBalancesByDateRange(
          props.balances,
          props.dateRange[0] ?? getDateFromMonthsAgo(1),
          props.dateRange[1] ?? new Date()
        ),
        props.accounts
      )}
      series={[
        { name: "assets", label: "Assets", color: "green.6", type: "bar" },
        {
          name: "liabilities",
          label: "Liabilities",
          color: "red.6",
          type: "bar",
        },
        { name: "net", label: "Net", color: "gray.0", type: "line" },
      ]}
      withLegend
      dataKey="dateString"
      composedChartProps={{ stackOffset: "sign" }}
      barProps={{
        stackId: "stack",
        fillOpacity: 0.4,
        strokeOpacity: 1,
      }}
      lineProps={{ type: "linear" }}
      tooltipAnimationDuration={200}
      valueFormatter={(value) => convertNumberToCurrency(value, true)}
    />
  );
};

export default NetWorthChart;

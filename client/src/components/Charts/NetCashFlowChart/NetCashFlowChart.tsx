import { convertNumberToCurrency } from "@helpers/currency";
import { getMonthAndYearDateString } from "@helpers/datetime";
import { getTransactionsForMonth } from "@helpers/transactions";
import { areStringsEqual } from "@helpers/utils";
import { CompositeChart } from "@mantine/charts";
import { Skeleton } from "@mantine/core";
import { ITransaction } from "@models/transaction";
import React from "react";

interface ChartDatum {
  month: string;
  Income: number;
  Spending: number;
  Net: number;
}

interface NetCashFlowChartProps {
  transactions: ITransaction[];
  months: Date[];
  isPending?: boolean;
  includeGrid?: boolean;
  includeYAxis?: boolean;
}

const NetCashFlowChart = (props: NetCashFlowChartProps): React.ReactNode => {
  const sortedMonths = props.months.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const buildChartData = (): ChartDatum[] => {
    const spendingTrendsChartData: ChartDatum[] = [];

    sortedMonths.forEach((month) => {
      const transactionsForMonth = getTransactionsForMonth(
        props.transactions,
        month
      );

      const incomeTotal = transactionsForMonth.reduce(
        (acc: number, curr: ITransaction) =>
          areStringsEqual(curr.category ?? "", "Income")
            ? acc + curr.amount
            : acc,
        0
      );

      const spendingTotal = transactionsForMonth.reduce(
        (acc: number, curr: ITransaction) =>
          !areStringsEqual(curr.category ?? "", "Income")
            ? acc + curr.amount
            : acc,
        0
      );

      spendingTrendsChartData.push({
        month: getMonthAndYearDateString(month),
        Income: incomeTotal,
        Spending: spendingTotal,
        Net: incomeTotal + spendingTotal,
      });
    });
    return spendingTrendsChartData;
  };

  if (props.isPending) {
    return <Skeleton height={425} />;
  }

  if (props.months.length === 0) {
    return <div>No data to display.</div>;
  }

  return (
    <CompositeChart
      h={400}
      w="100%"
      data={buildChartData()}
      series={[
        { name: "Income", color: "green.6", type: "bar" },
        { name: "Spending", color: "red.6", type: "bar" },
        { name: "Net", color: "gray.0", type: "line" },
      ]}
      withLegend
      dataKey="month"
      composedChartProps={{ stackOffset: "sign" }}
      barProps={{
        stackId: "stack",
        fillOpacity: 0.4,
        strokeOpacity: 1,
      }}
      lineProps={{ type: "linear" }}
      valueFormatter={(value) => convertNumberToCurrency(value, true)}
    />
  );
};

export default NetCashFlowChart;

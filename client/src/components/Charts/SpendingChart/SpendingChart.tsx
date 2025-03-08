import { ITransaction } from "@models/transaction";
import { AreaChart } from "@mantine/charts";
import React from "react";
import {
  buildTransactionChartData,
  buildTransactionChartSeries,
} from "@helpers/charts";
import { convertNumberToCurrency } from "@helpers/currency";
import { Skeleton } from "@mantine/core";

interface SpendingChartProps {
  transactions: ITransaction[];
  months: Date[];
  isPending?: boolean;
  includeGrid?: boolean;
  includeYAxis?: boolean;
}

const SpendingChart = (props: SpendingChartProps): React.ReactNode => {
  const sortedMonths = props.months.sort((a, b) => a.getTime() - b.getTime());

  if (props.isPending) {
    return <Skeleton height={425} />;
  }

  return (
    <AreaChart
      h={400}
      w="100%"
      series={buildTransactionChartSeries(sortedMonths)}
      data={buildTransactionChartData(sortedMonths, props.transactions)}
      dataKey="day"
      valueFormatter={(value) => convertNumberToCurrency(value, true)}
      withLegend
      curveType="monotone"
    />
  );
};

export default SpendingChart;

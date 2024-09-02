import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  getRollingTotalSpendingForMonth,
  getTransactionsForMonth,
} from '@/lib/transactions';
import { getMonthAndYearDateString } from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import { Area, AreaChart, XAxis } from 'recharts';

interface SpendingTrendsChartProps {
  transactions: Transaction[];
  months: Date[];
}

interface SpendingTrendsChartData {
  day: number;
  amount1?: number;
  amount2?: number;
}

const SpendingTrendsChart = (props: SpendingTrendsChartProps): JSX.Element => {
  const chartConfig = {
    amount1: {
      label: getMonthAndYearDateString(props.months.at(0) ?? new Date()),
      color: 'hsl(var(--chart-1))',
    },
    amount2: {
      label: getMonthAndYearDateString(props.months.at(1) ?? new Date()),
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  const getChartData = () => {
    let spendingTrendsChartData: SpendingTrendsChartData[] = [];
    props.months.forEach((month, index) => {
      const transactionsForMonth = getTransactionsForMonth(props.transactions, month);

      const rollingTotalTransactionsForMonth =
        getRollingTotalSpendingForMonth(transactionsForMonth);

      rollingTotalTransactionsForMonth.forEach((rollingTotalTransaction) => {
        const chartDay = spendingTrendsChartData.find(
          (data) => data.day === rollingTotalTransaction.day
        );

        if (chartDay == null) {
          const newChartDay: SpendingTrendsChartData = {
            day: rollingTotalTransaction.day,
          };
          if (index == 0) {
            newChartDay.amount1 = rollingTotalTransaction.amount;
          } else {
            newChartDay.amount2 = rollingTotalTransaction.amount;
          }
          spendingTrendsChartData.push(newChartDay);
        } else {
          if (index == 0) {
            chartDay.amount1 = rollingTotalTransaction.amount;
          } else {
            chartDay.amount2 = rollingTotalTransaction.amount;
          }
        }
      });
    });
    return spendingTrendsChartData;
  };

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <AreaChart data={getChartData()}>
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {props.months.length === 2 && (
            <Area
              dataKey="amount2"
              type={'monotone'}
              fill="var(--color-amount2)"
              fillOpacity={0.1}
              stroke="var(--color-amount2)"
              dot={{
                fill: 'var(--color-amount2)',
              }}
              activeDot={{
                r: 5,
              }}
            />
          )}
          <Area
            dataKey="amount1"
            type={'monotone'}
            fill="var(--color-amount1)"
            fillOpacity={0.5}
            stroke="var(--color-amount1)"
            dot={{
              fill: 'var(--color-amount1)',
            }}
            activeDot={{
              r: 5,
            }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default SpendingTrendsChart;

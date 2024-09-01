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
import { Transaction } from '@/types/transaction';
import { Area, AreaChart, XAxis } from 'recharts';

const chartConfig = {
  amount1: {
    label: 'This Month',
    color: 'hsl(var(--chart-1))',
  },
  amount2: {
    label: 'Last Month',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

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
            />
          )}
          <Area
            dataKey="amount1"
            type={'monotone'}
            fill="var(--color-amount1)"
            fillOpacity={0.6}
            stroke="var(--color-amount1)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default SpendingTrendsChart;

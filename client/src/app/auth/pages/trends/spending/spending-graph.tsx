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
import {
  convertNumberToCurrency,
  getDaysInMonth,
  getMonthAndYearDateString,
} from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface SpendingGraphProps {
  transactions: Transaction[];
  months: Date[];
  includeGrid?: boolean;
  includeYAxis?: boolean;
}

interface SpendingGraphData {
  day: number;
  amount1?: number;
  amount2?: number;
}

const SpendingGraph = (props: SpendingGraphProps): JSX.Element => {
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
    let spendingTrendsChartData: SpendingGraphData[] = [];
    props.months.forEach((month, index) => {
      const transactionsForMonth = getTransactionsForMonth(props.transactions, month);

      const today = new Date();
      const isThisMonth =
        month.getMonth() === today.getMonth() &&
        month.getFullYear() === today.getFullYear();

      const rollingTotalTransactionsForMonth = getRollingTotalSpendingForMonth(
        transactionsForMonth,
        isThisMonth
          ? today.getDate()
          : getDaysInMonth(month.getMonth(), month.getFullYear())
      );

      rollingTotalTransactionsForMonth.forEach((rollingTotalTransaction) => {
        const chartDay = spendingTrendsChartData.find(
          (data) => data.day === rollingTotalTransaction.day
        );

        if (chartDay == null) {
          const newChartDay: SpendingGraphData = {
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
      <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
        <AreaChart data={getChartData()}>
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          {props.includeYAxis && (
            <YAxis tickFormatter={(value) => convertNumberToCurrency(value as number)} />
          )}
          {props.includeGrid && <CartesianGrid strokeDasharray="3 3" />}
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                className="w-[220px]"
                formatter={(value, name) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                      style={
                        {
                          '--color-bg': `var(--color-${name})`,
                        } as React.CSSProperties
                      }
                    />
                    {chartConfig[name as keyof typeof chartConfig]?.label || name}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {convertNumberToCurrency(value as number, true)}
                    </div>
                  </>
                )}
              />
            }
          />
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

export default SpendingGraph;

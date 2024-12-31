import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BuildTransactionChartConfig,
  BuildTransactionChartData,
  getChartColor,
} from '@/lib/chart';
import { convertNumberToCurrency, getMonthAndYearDateString } from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface SpendingGraphProps {
  transactions: Transaction[];
  months: Date[];
  includeGrid?: boolean;
  includeYAxis?: boolean;
}

const SpendingGraph = (props: SpendingGraphProps): JSX.Element => {
  const sortedMonths = props.months.sort((a, b) => a.getTime() - b.getTime());

  const chartConfig = BuildTransactionChartConfig(sortedMonths);
  const chartData = BuildTransactionChartData(sortedMonths, props.transactions);

  return (
    <div>
      <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
        <AreaChart data={chartData}>
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
          {sortedMonths.map((month) => (
            <Area
              key={getMonthAndYearDateString(month)}
              dataKey={getMonthAndYearDateString(month)}
              type="monotone"
              fill={getChartColor(getMonthAndYearDateString(month), chartConfig)}
              fillOpacity={0.5}
              stroke={getChartColor(getMonthAndYearDateString(month), chartConfig)}
              dot={{
                fill: getChartColor(getMonthAndYearDateString(month), chartConfig),
              }}
              activeDot={{
                r: 5,
              }}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default SpendingGraph;

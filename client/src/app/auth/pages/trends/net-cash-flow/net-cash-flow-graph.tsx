import { AuthContext } from '@/components/auth-provider';
import MonthToolCards from '@/components/month-toolcards';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { buildTimeToMonthlyTotalsMap } from '@/lib/budgets';
import { getChartColor } from '@/lib/chart';
import { filterHiddenTransactions, getTransactionsForMonth } from '@/lib/transactions';
import {
  areStringsEqual,
  convertNumberToCurrency,
  getDateFromMonthsAgo,
  getUniqueYears,
  initCurrentMonth,
} from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import { useQueries } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';

const NetCashFlowGraph = () => {
  const [selectedMonths, setSelectedMonths] = React.useState<Date[]>([
    getDateFromMonthsAgo(1),
    initCurrentMonth(),
  ]);

  // Querying by year is the best balance of covering probable dates a user will select,
  // while also not potentially querying for a large amount of data.
  const { request } = React.useContext<any>(AuthContext);
  const transactionsQuery = useQueries({
    queries: getUniqueYears(selectedMonths).map((year: number) => ({
      queryKey: ['transactions', { year }],
      queryFn: async (): Promise<Transaction[]> => {
        const res: AxiosResponse = await request({
          url: '/api/transaction',
          method: 'GET',
          params: { year },
        });

        if (res.status == 200) {
          return res.data;
        }

        return [];
      },
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data ?? []).flat(1),
        isPending: results.some((result) => result.isPending),
      };
    },
  });

  // We need to filter out the transactions labelled with 'Hide From Budgets'
  const transactionsWithoutHidden = filterHiddenTransactions(
    transactionsQuery.data ?? []
  );

  interface ChartDatum {
    month: Date;
    income: number;
    spending: number;
    net: number;
  }

  const sortedMonths = selectedMonths.sort((a, b) => a.getTime() - b.getTime());

  const BuildChartData = (): ChartDatum[] => {
    const spendingTrendsChartData: ChartDatum[] = [];

    sortedMonths.forEach((month) => {
      const transactionsForMonth = getTransactionsForMonth(
        transactionsWithoutHidden,
        month
      );

      const incomeTotal = transactionsForMonth.reduce(
        (acc, curr) =>
          areStringsEqual(curr.category ?? '', 'Income') ? acc + curr.amount : acc,
        0
      );

      const spendingTotal = transactionsForMonth.reduce(
        (acc, curr) =>
          !areStringsEqual(curr.category ?? '', 'Income') ? acc + curr.amount : acc,
        0
      );

      spendingTrendsChartData.push({
        month,
        income: incomeTotal,
        spending: spendingTotal,
        net: incomeTotal + spendingTotal,
      });
    });
    return spendingTrendsChartData;
  };

  const chartData: ChartDatum[] = BuildChartData();
  const chartConfig = {
    income: {
      label: 'Income',
      color: 'hsl(var(--success))',
    },
    spending: {
      label: 'Spending',
      color: 'hsl(var(--destructive))',
    },
    net: {
      label: 'Net Cashflow',
      color: 'hsl(var(--foreground))',
    },
  } satisfies ChartConfig;

  if (transactionsQuery.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[62px] w-full" />
        <Skeleton className="aspect-video max-h-[400px] w-full" />
      </div>
    );
  }

  const monthButtons = [3, 6, 12];

  return (
    <div className="flex w-full flex-col gap-4">
      <MonthToolCards
        selectedDates={selectedMonths}
        setSelectedDates={setSelectedMonths}
        timeToMonthlyTotalsMap={buildTimeToMonthlyTotalsMap(
          selectedMonths,
          transactionsWithoutHidden
        )}
        showCopy={false}
        isPending={false}
        allowSelectMultiple={true}
      />
      <div className="flex w-full flex-row flex-wrap justify-end gap-2">
        {monthButtons.map((months) => (
          <Button
            size="sm"
            variant="outline"
            key={months}
            onClick={() => {
              // Clear prior to adding new months to prevent duplicates.
              setSelectedMonths([]);
              for (let i = 0; i < months; i++) {
                setSelectedMonths((prev) => {
                  const newMonths = [...prev];
                  newMonths.push(getDateFromMonthsAgo(i));
                  return newMonths;
                });
              }
            }}
          >
            Last {months} Months
          </Button>
        ))}
        <Button size="sm" onClick={() => setSelectedMonths([])}>
          Clear
        </Button>
      </div>
      {selectedMonths.length === 0 ? (
        <div className="flex aspect-video max-h-[400px] w-full items-center justify-center">
          <span className="text-center">Select an account to display the chart.</span>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <ComposedChart accessibilityLayer data={chartData} stackOffset="sign">
            <CartesianGrid vertical={true} />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[220px]"
                  labelFormatter={(_, payload) => {
                    // This is jank but it works
                    return new Date(payload[0].payload.month).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        year: 'numeric',
                      }
                    );
                  }}
                  formatter={(value, name, item) => (
                    <div className="custom-tooltip flex w-full flex-col gap-1">
                      <div className="flex flex-row items-center gap-1">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={
                            {
                              '--color-bg': item.color,
                            } as React.CSSProperties
                          }
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label || name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {convertNumberToCurrency(value as number, true)}
                        </div>
                      </div>
                    </div>
                  )}
                />
              }
            />
            <XAxis
              dataKey="month"
              tickLine={true}
              tickMargin={15}
              minTickGap={0}
              axisLine={true}
              angle={-45}
              tickFormatter={(value) =>
                (new Date(value).getMonth() + 1).toString() +
                '/' +
                new Date(value).getFullYear().toString()
              }
            />
            <YAxis tickFormatter={(value) => convertNumberToCurrency(value as number)} />
            <Bar
              dataKey={'income'}
              type="step"
              fill={getChartColor('income', chartConfig)}
              fillOpacity={0.4}
              stroke={getChartColor('income', chartConfig)}
              stackId="a"
            />
            <Bar
              dataKey={'spending'}
              type="step"
              fill={getChartColor('spending', chartConfig)}
              fillOpacity={0.4}
              stroke={getChartColor('spending', chartConfig)}
              stackId="a"
            />
            <Line
              dataKey={'net'}
              type="linear"
              stroke={getChartColor('net', chartConfig)}
              dot={{
                fill: getChartColor('net', chartConfig),
              }}
              activeDot={{
                r: 6,
              }}
              strokeWidth={2}
            />
          </ComposedChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default NetCashFlowGraph;

import { AuthContext } from '@/components/auth-provider';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { BuildNetWorthChartData, getChartColor } from '@/lib/chart';
import { convertNumberToCurrency, getDateFromMonthsAgo } from '@/lib/utils';
import { IAccount } from '@/types/account';
import { IBalance } from '@/types/balance';
import { useQueries, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import AccountsGraphHeader from '../accounts-graph-header';
import { DateRange } from 'react-day-picker';

const NetWorthGraph = (): JSX.Element => {
  const [selectedAccountIds, setSelectedAccountIds] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: getDateFromMonthsAgo(1),
    to: new Date(),
  });

  const { request } = React.useContext<any>(AuthContext);
  const balancesQuery = useQueries({
    queries: selectedAccountIds.map((accountId: string) => ({
      queryKey: ['balances', accountId],
      queryFn: async (): Promise<IBalance[]> => {
        const res: AxiosResponse = await request({
          url: '/api/balance',
          method: 'GET',
          params: { accountId },
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

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<IAccount[]> => {
      const res: AxiosResponse = await request({
        url: '/api/account',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as IAccount[];
      }

      return [];
    },
  });

  const chartData = BuildNetWorthChartData(
    balancesQuery.data ?? [],
    accountsQuery.data ?? [],
    dateRange.from ?? getDateFromMonthsAgo(1),
    dateRange.to ?? new Date()
  );
  const chartConfig = {
    assets: {
      label: 'Assets',
      color: 'hsl(var(--success))',
    },
    liabilities: {
      label: 'Liabilities',
      color: 'hsl(var(--destructive))',
    },
    net: {
      label: 'Net Worth',
      color: 'hsl(var(--foreground))',
    },
  } satisfies ChartConfig;

  if (balancesQuery.isPending || accountsQuery.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[40px] w-full max-w-[300px]" />
        <Skeleton className="aspect-video max-h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AccountsGraphHeader
        selectedAccountIds={selectedAccountIds}
        setSelectedAccountIds={setSelectedAccountIds}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      {selectedAccountIds.length === 0 ? (
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
                    return new Date(payload[0].payload.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
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
              dataKey="date"
              tickLine={true}
              tickMargin={15}
              minTickGap={0}
              axisLine={true}
              angle={-45}
              tickFormatter={(value) =>
                (new Date(value).getMonth() + 1).toString() +
                '/' +
                new Date(value).getDate().toString()
              }
            />
            <YAxis tickFormatter={(value) => convertNumberToCurrency(value as number)} />
            <Bar
              dataKey={'assets'}
              type="step"
              fill={getChartColor('assets', chartConfig)}
              fillOpacity={0.4}
              stroke={getChartColor('assets', chartConfig)}
              stackId="a"
            />
            <Bar
              dataKey={'liabilities'}
              type="step"
              fill={getChartColor('liabilities', chartConfig)}
              fillOpacity={0.4}
              stroke={getChartColor('liabilities', chartConfig)}
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

export default NetWorthGraph;

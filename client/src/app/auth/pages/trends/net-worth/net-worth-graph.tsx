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
import { getAccountBalanceMap, getAverageBalanceForDates } from '@/lib/balances';
import { getChartColor } from '@/lib/chart';
import { convertNumberToCurrency, getDateFromMonthsAgo } from '@/lib/utils';
import { Account, liabilityAccountTypes } from '@/types/account';
import { IBalance } from '@/types/balance';
import { useQueries, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import AccountsGraphHeader from '../accounts-graph-header';

const NetWorthGraph = (): JSX.Element => {
  const [selectedAccountIds, setSelectedAccountIds] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState<Date>(getDateFromMonthsAgo(1));
  const [endDate, setEndDate] = React.useState<Date>(new Date());

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
    queryFn: async (): Promise<Account[]> => {
      const res: AxiosResponse = await request({
        url: '/api/account',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  interface ChartDatum {
    date: Date;
    assets: number;
    liabilities: number;
    net: number;
  }

  const BuildChartData = () => {
    // We need to create new dates that only have the year, month, and day to filter out duplicate dates
    const sortedDates: Date[] = balancesQuery.data
      .map(
        (balance) =>
          new Date(
            new Date(balance.dateTime).getFullYear(),
            new Date(balance.dateTime).getMonth(),
            new Date(balance.dateTime).getDate()
          )
      )
      .sort((a, b) => a.getTime() - b.getTime());

    // Filter out duplicate dates and dates outside the selected range
    const filteredDates: Date[] = sortedDates.filter((date, index, array) => {
      return (
        array.findIndex((d) => d.getTime() === date.getTime()) === index &&
        date >= startDate &&
        date <= endDate
      );
    });

    const accountBalanceMap: Map<string, IBalance[]> = getAccountBalanceMap(
      balancesQuery.data ?? []
    );
    const chartData: ChartDatum[] = [];

    // We need a data point for each date because we have at least 1 account that has a balance for that date.
    filteredDates.forEach((date: Date) => {
      const chartDatum: ChartDatum = {
        date,
        assets: 0,
        liabilities: 0,
        net: 0,
      };
      chartData.push(chartDatum);
    });

    accountBalanceMap.forEach((balances, accountId) => {
      // We need to group the balances by date to get the average balance for each date
      const groupedBalances = getAverageBalanceForDates(balances);

      const firstBalanceDate = new Date(
        new Date(groupedBalances[0].dateTime).getFullYear(),
        new Date(groupedBalances[0].dateTime).getMonth(),
        new Date(groupedBalances[0].dateTime).getDate()
      );

      // We need to know where the first date is in the filtered dates array to know where to start adding balances
      const dateStart = chartData.findIndex(
        (datum: ChartDatum) => datum.date.getTime() === firstBalanceDate.getTime()
      );

      if (dateStart === -1) {
        return;
      }

      let balanceIterator = 0;

      chartData.forEach((datum: ChartDatum) => {
        const account = accountsQuery.data?.find((account) => account.id === accountId);
        if (account == null) {
          return;
        }
        const chartIndex = liabilityAccountTypes.includes(account.type)
          ? 'liabilities'
          : 'assets';

        const balance = groupedBalances[balanceIterator];
        if (balance == null) {
          return;
        }

        const balanceDate = new Date(
          new Date(balance.dateTime).getFullYear(),
          new Date(balance.dateTime).getMonth(),
          new Date(balance.dateTime).getDate()
        );

        if (datum.date.getTime() < balanceDate.getTime()) {
          datum[chartIndex] += groupedBalances[balanceIterator - 1]?.amount ?? 0;
        } else {
          datum[chartIndex] += balance.amount;
          if (balanceIterator < balances.length - 1) {
            balanceIterator++;
          }
        }
      });
    });

    // Calculate the net worth.
    chartData.forEach((datum: ChartDatum) => {
      datum.net = datum.assets + datum.liabilities;
    });

    return chartData;
  };

  const chartData = BuildChartData();
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
        {...{
          selectedAccountIds,
          setSelectedAccountIds,
          startDate,
          setStartDate,
          endDate,
          setEndDate,
        }}
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
                  formatter={(value, name) => (
                    <div className="custom-tooltip flex flex-col gap-1">
                      <div className="flex flex-row items-center gap-1">
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

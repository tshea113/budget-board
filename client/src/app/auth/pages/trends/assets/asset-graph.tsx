import { AuthContext } from '@/components/auth-provider';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { getAccountBalanceMap } from '@/lib/balances';
import {
  BuildAccountsBalanceChartConfig,
  getChartColor,
  sumTooltipValues,
} from '@/lib/chart';
import { convertNumberToCurrency, getDateFromMonthsAgo } from '@/lib/utils';
import { Account } from '@/types/account';
import { IBalance } from '@/types/balance';
import { useQueries, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import AccountsGraphHeader from '../accounts-graph-header';

const AssetsGraph = (): JSX.Element => {
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

  const BuildChartData = () => {
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

    const filteredDates: Date[] = sortedDates.filter((date, index, array) => {
      // Check whether the value is unique and within the specified dates.
      return (
        array.findIndex((d) => d.getTime() === date.getTime()) === index &&
        date >= startDate &&
        date <= endDate
      );
    });

    const accountBalanceMap = getAccountBalanceMap(balancesQuery.data ?? []);
    const chartData: any[] = [];

    filteredDates.forEach((date: Date, dateIndex: number) => {
      const chartDatum: any = {
        date,
      };

      accountBalanceMap.forEach((balances, accountId) => {
        const balance = balances.find(
          (b) =>
            new Date(
              new Date(b.dateTime).getFullYear(),
              new Date(b.dateTime).getMonth(),
              new Date(b.dateTime).getDate()
            ).getTime() === date.getTime()
        );

        if (balance == null) {
          // The first date will have no previous value to carry over. Set it to 0.
          if (dateIndex === 0) {
            chartDatum[accountId] = 0;
          } else {
            // Carry over the previous value
            chartDatum[accountId] = chartData[dateIndex - 1][accountId];
          }
        } else {
          chartDatum[accountId] = balance.amount;
        }
      });

      chartData.push(chartDatum);
    });

    return chartData;
  };

  const chartData = BuildChartData();
  const chartConfig = BuildAccountsBalanceChartConfig(
    balancesQuery.data ?? [],
    accountsQuery.data ?? [],
    selectedAccountIds
  );

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
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        filters={['Checking', 'Savings', 'Investment', 'Cash']}
      />
      {selectedAccountIds.length === 0 ? (
        <div className="flex aspect-video max-h-[400px] w-full items-center justify-center">
          <span className="text-center">Select an account to display the chart.</span>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
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
                  formatter={(value, name, item, index) => (
                    <div className="custom-tooltip flex w-full flex-col gap-1">
                      <div className="flex flex-row justify-between gap-1">
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
                      {/* Add this after the last item */}
                      {index === selectedAccountIds.length - 1 && (
                        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                          Total
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {convertNumberToCurrency(
                              sumTooltipValues(item.payload),
                              true
                            )}
                          </div>
                        </div>
                      )}
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
            {selectedAccountIds.map((accountId) => (
              <Bar
                key={accountId}
                dataKey={accountId}
                type="step"
                fill={getChartColor(accountId, chartConfig)}
                fillOpacity={0.4}
                stroke={getChartColor(accountId, chartConfig)}
                stackId="a"
              />
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AssetsGraph;

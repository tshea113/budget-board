import AccountInput from '@/components/account-input';
import { AuthContext } from '@/components/auth-provider';
import DatePicker from '@/components/date-picker';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { getAccountBalanceMap } from '@/lib/balances';
import { sumTooltipValues } from '@/lib/chart';
import {
  convertNumberToCurrency,
  getDateFromMonthsAgo,
  getStandardDate,
  initCurrentMonth,
} from '@/lib/utils';
import { Account } from '@/types/account';
import { IBalance } from '@/types/balance';
import { useQueries, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const DebtsGraph = (): JSX.Element => {
  const [selectedAccountIds, setSelectedAccountIds] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState<Date>(getDateFromMonthsAgo(1));
  const [endDate, setEndDate] = React.useState<Date>(initCurrentMonth());

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

  const BuildChartConfig = (): ChartConfig => {
    const accountBalanceMap: Map<string, IBalance[]> = getAccountBalanceMap(
      balancesQuery.data ?? []
    );
    const chartConfig: ChartConfig = {};

    accountBalanceMap.forEach((_balances: IBalance[], accountId: string) => {
      const account = accountsQuery.data?.find((a) => a.id === accountId);

      if (account == null) {
        return;
      }

      // There are 5 colors for the chart lines. We will cycle through them.
      const lineColorNumber = (
        (selectedAccountIds.indexOf(accountId) + 1) %
        5
      ).toString();

      chartConfig[accountId] = {
        label: account.name,
        color: `hsl(var(--chart-${lineColorNumber}))`,
      };
    });

    return chartConfig;
  };

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
          // Since we are tracking debt amount, we need to invert the value of the balance.
          chartDatum[accountId] = balance.amount * -1;
        }
      });

      chartData.push(chartDatum);
    });

    return chartData;
  };

  const getChartColor = (accountId: string) => chartConfig[accountId].color;

  const chartData = BuildChartData();
  const chartConfig = BuildChartConfig();

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
      <div className="flex w-full max-w-[300px] flex-row items-end gap-2">
        <AccountInput
          selectedAccountIds={selectedAccountIds}
          setSelectedAccountIds={setSelectedAccountIds}
          hideHidden={true}
          filterTypes={['Loan', 'Credit Card', 'Mortgage']}
        />
        <div className="flex flex-col gap-1">
          <span>Start Date</span>
          <DatePicker
            value={startDate}
            onDayClick={(date: Date) => {
              setStartDate(getStandardDate(date));
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>End Date</span>
          <DatePicker
            value={endDate}
            onDayClick={(date: Date) => {
              if (date.getTime() > startDate.getTime()) {
                setEndDate(getStandardDate(date));
              }
            }}
          />
        </div>
      </div>
      <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={true} />
          <ChartLegend content={<ChartLegendContent />} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                className="w-[220px]"
                formatter={(value, name, item, index) => (
                  <div className="custom-tooltip flex flex-col gap-1">
                    <div>
                      {new Date(item.payload.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
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
                    {/* Add this after the last item */}
                    {index === selectedAccountIds.length - 1 && (
                      <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                        Total
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {convertNumberToCurrency(sumTooltipValues(item.payload), true)}
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
              fill={getChartColor(accountId)}
              fillOpacity={0.4}
              stroke={getChartColor(accountId)}
              stackId="a"
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default DebtsGraph;

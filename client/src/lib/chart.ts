import { ChartConfig } from '@/components/ui/chart';
import { IBalance } from '@/types/balance';
import {
  getAccountBalanceMap,
  getAverageBalanceForDates,
  getInitialBalanceDate,
  getSortedBalanceDates,
} from './balances';
import { Account, liabilityAccountTypes } from '@/types/account';
import {
  getDaysInMonth,
  getMonthAndYearDateString,
  getStandardDate,
  getUniqueDatesInRange,
} from './utils';
import { Transaction } from '@/types/transaction';
import {
  getRollingTotalSpendingForMonth,
  getTransactionsForMonth,
  RollingTotalSpendingPerDay,
} from './transactions';

/**
 * Gets a list of average balances for each date in the given date range.
 * @param balances A list of balances
 * @param startDate The start date for the range
 * @param endDate The end date for the range
 * @returns A list of average balances for each date in the given date range
 */
const getAveragedBalancesInRange = (
  balances: IBalance[],
  startDate: Date,
  endDate: Date
): IBalance[] => {
  // Scope balances down to the specified range
  const balancesInRange = balances.filter((balance) => {
    const standardBalanceDate = getStandardDate(balance.dateTime);
    console.log(getInitialBalanceDate(balances, startDate), standardBalanceDate);
    return (
      standardBalanceDate.getTime() >=
        getInitialBalanceDate(balances, startDate).getTime() &&
      standardBalanceDate.getTime() <= endDate.getTime()
    );
  });

  return getAverageBalanceForDates(balancesInRange);
};

/**
 * Sums the values of a given tooltip object.
 * @param tooltipValues The tooltip payload object
 * @returns The sum of the tooltip values
 */
export const sumTooltipValues = (tooltipPayload: any): number => {
  let total = 0;

  Object.values(tooltipPayload).forEach((property) => {
    // We want to exclude any other values that are not numbers (like the date).
    if (typeof property === 'number') {
      total += property;
    }
  });

  return total;
};

/**
 * Gets the chart color for a given account ID.
 * @param chartConfigIndex The index to get the color for
 * @param chartConfig The chart configuration for the given chart
 * @returns The color for the given account ID
 */
export const getChartColor = (
  chartConfigIndex: string,
  chartConfig: ChartConfig
): string => chartConfig[chartConfigIndex].color ?? '';

/**
 * Builds a chart configuration of accounts balances for the selected accounts.
 * @param balancesQueryData A list of balance query results
 * @param accountsQueryData A list of account query results
 * @param selectedAccountIds The selected accounts to display in the chart
 * @returns The chart configuration for the selected accounts
 */
export const BuildAccountsBalanceChartConfig = (
  balances: IBalance[],
  accounts: Account[],
  selectedAccountIds: string[]
): ChartConfig => {
  const accountBalanceMap: Map<string, IBalance[]> = getAccountBalanceMap(balances);
  const chartConfig: ChartConfig = {};

  accountBalanceMap.forEach((_balances: IBalance[], accountId: string) => {
    const account = accounts.find((account: Account) => account.id === accountId);

    if (account == null) {
      return;
    }

    // There are 5 colors for the chart lines. We will cycle through them.
    const lineColorNumber = ((selectedAccountIds.indexOf(accountId) % 4) + 1).toString();

    chartConfig[accountId] = {
      label: account.name,
      color: `hsl(var(--chart-${lineColorNumber}))`,
    };
  });

  return chartConfig;
};

/**
 * Builds a chart data object for the account balances.
 * @param balances A list of accounts balances
 * @param startDate The start date for the chart data
 * @param endDate The end date for the chart data
 * @param invertData True if you would like to invert the chart data for debts
 * @returns A chart data object for the account balances
 */
export const BuildAccountBalanceChartData = (
  balances: IBalance[],
  startDate: Date,
  endDate: Date,
  invertData = false
) => {
  const filteredDates: Date[] = getUniqueDatesInRange(
    getSortedBalanceDates(balances),
    startDate,
    endDate
  );

  const accountBalanceMap: Map<string, IBalance[]> = getAccountBalanceMap(balances);

  const chartData: any[] = filteredDates.map((date: Date) => {
    const datum: any = { date };
    accountBalanceMap.forEach((_, accountId) => {
      datum[accountId] = 0;
    });
    return datum;
  });

  accountBalanceMap.forEach((balances, accountId) => {
    const averagedBalancesInRange = getAveragedBalancesInRange(
      balances,
      startDate,
      endDate
    );

    console.log(averagedBalancesInRange);

    let balanceIterator = 0;

    chartData.forEach((datum: any) => {
      const balance = averagedBalancesInRange[balanceIterator];
      if (balance == null) {
        return;
      }

      const balanceDate = getStandardDate(
        new Date(
          new Date(balance.dateTime).getFullYear(),
          new Date(balance.dateTime).getMonth(),
          new Date(balance.dateTime).getDate()
        )
      );

      if (datum.date.getTime() < balanceDate.getTime()) {
        datum[accountId] =
          (averagedBalancesInRange[balanceIterator - 1]?.amount ?? 0) *
          (invertData ? -1 : 1);
      } else {
        datum[accountId] = balance.amount * (invertData ? -1 : 1);
        if (balanceIterator < balances.length - 1) {
          balanceIterator++;
        }
      }
    });
  });

  return chartData;
};

export interface NetWorthChartDatum {
  date: Date;
  assets: number;
  liabilities: number;
  net: number;
}

/**
 * Builds a chart data object for net worth.
 * @param balances A list of balances
 * @param accounts A list of accounts
 * @param startDate Start date for the chart data
 * @param endDate End date for the chart data
 * @returns A chart data object for the given data
 */
export const BuildNetWorthChartData = (
  balances: IBalance[],
  accounts: Account[],
  startDate: Date,
  endDate: Date
): NetWorthChartDatum[] => {
  // We need to create a list of unique dates in the range of the start and end date for the given balances.
  const filteredDates: Date[] = getUniqueDatesInRange(
    getSortedBalanceDates(balances),
    startDate,
    endDate
  );

  // We need a data point for each date because we have at least 1 account that has a balance for that date.
  const chartData = filteredDates.map((date: Date) => {
    return {
      date,
      assets: 0,
      liabilities: 0,
      net: 0,
    };
  });

  const accountBalanceMap: Map<string, IBalance[]> = getAccountBalanceMap(balances);
  accountBalanceMap.forEach((balances, accountId) => {
    const averagedBalancesInRange = getAveragedBalancesInRange(
      balances,
      startDate,
      endDate
    );

    let balanceIterator = 0;

    chartData.forEach((datum: NetWorthChartDatum) => {
      const account = accounts.find((account) => account.id === accountId);
      if (account == null) {
        return;
      }
      const chartIndex = liabilityAccountTypes.includes(account.type)
        ? 'liabilities'
        : 'assets';

      const balance = averagedBalancesInRange[balanceIterator];
      if (balance == null) {
        return;
      }

      const balanceDate = getStandardDate(
        new Date(
          new Date(balance.dateTime).getFullYear(),
          new Date(balance.dateTime).getMonth(),
          new Date(balance.dateTime).getDate()
        )
      );

      if (datum.date.getTime() < balanceDate.getTime()) {
        datum[chartIndex] += averagedBalancesInRange[balanceIterator - 1]?.amount ?? 0;
      } else {
        datum[chartIndex] += balance.amount;
        if (balanceIterator < balances.length - 1) {
          balanceIterator++;
        }
      }
    });
  });

  // Calculate the net worth.
  chartData.forEach((datum: NetWorthChartDatum) => {
    datum.net = datum.assets + datum.liabilities;
  });

  return chartData;
};

/**
 * Builds a chart configuration for the transaction data.
 * @param months A list of months to build the chart configuration for
 * @returns The chart configuration for the transaction data
 */
export const BuildTransactionChartConfig = (months: Date[]): ChartConfig => {
  const chartConfig: ChartConfig = {};

  months.forEach((month: Date) => {
    // There are 5 colors for the chart lines. We will cycle through them.
    const lineColorNumber = (
      (months.findIndex((m) => m.getTime() === month.getTime()) % 5) +
      1
    ).toString();

    chartConfig[getMonthAndYearDateString(month)] = {
      label: getMonthAndYearDateString(month),
      color: `hsl(var(--chart-${lineColorNumber}))`,
    };
  });
  return chartConfig;
};

/**
 * Builds the chart data for the given months and transactions.
 * @param months A list of selected months
 * @param transactions A list of transactions
 * @returns The chart data for the given data
 */
export const BuildTransactionChartData = (
  months: Date[],
  transactions: Transaction[]
): any[] => {
  let spendingTrendsChartData: any[] = [];
  months.forEach((month) => {
    const transactionsForMonth = getTransactionsForMonth(transactions, month);

    // If it is the current month, we only want to show the data up to today's date.
    const today = new Date();
    const isThisMonth =
      month.getMonth() === today.getMonth() &&
      month.getFullYear() === today.getFullYear();

    const rollingTotalTransactionsForMonth: RollingTotalSpendingPerDay[] =
      getRollingTotalSpendingForMonth(
        transactionsForMonth,
        isThisMonth
          ? today.getDate()
          : getDaysInMonth(month.getMonth(), month.getFullYear())
      );

    rollingTotalTransactionsForMonth.forEach(
      (rollingTotalTransaction: RollingTotalSpendingPerDay) => {
        const chartDay = spendingTrendsChartData.find(
          (data) => data.day === rollingTotalTransaction.day
        );

        // On the very first loop, we need to create the data point.
        if (chartDay == null) {
          const newChartDay: any = {
            day: rollingTotalTransaction.day,
            [getMonthAndYearDateString(month)]: rollingTotalTransaction.amount,
          };
          spendingTrendsChartData.push(newChartDay);
        } else {
          chartDay[getMonthAndYearDateString(month)] = rollingTotalTransaction.amount;
        }
      }
    );
  });
  return spendingTrendsChartData;
};

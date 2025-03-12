import { ITransaction } from "@models/transaction";
import {
  getRollingTotalSpendingForMonth,
  getTransactionsForMonth,
  RollingTotalSpendingPerDay,
} from "./transactions";
import {
  getDaysInMonth,
  getMonthAndYearDateString,
  getStandardDate,
  getUniqueDates as getDistinctDates,
} from "./datetime";
import { IBalance } from "@models/balance";
import { getSortedBalanceDates } from "./balances";
import { IAccount } from "@models/account";

export const chartColors = [
  "indigo.6",
  "teal.6",
  "orange.6",
  "red.6",
  "yellow.6",
  "lime.6",
  "grape.6",
  "pink.6",
];

/**
 * Builds a dataset showing the cumulative spending trend for the given months.
 *
 * @param months - An array of Date objects representing each month to include.
 * @param transactions - A collection of transaction objects containing spending information.
 * @returns An array of objects containing day-by-day spending data across months.
 */
export const buildTransactionChartData = (
  months: Date[],
  transactions: ITransaction[]
): any[] => {
  const spendingTrendsChartData: any[] = [];
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
          chartDay[getMonthAndYearDateString(month)] =
            rollingTotalTransaction.amount;
        }
      }
    );
  });
  return spendingTrendsChartData;
};

/**
 * Builds the series for the transaction chart.
 *
 * @param months - An array of Date objects representing each month to include.
 * @returns An array of objects containing the name of the month and the color to use.
 */
export const buildTransactionChartSeries = (
  months: Date[]
): { name: string; color: string }[] =>
  months.map((month, i) => ({
    name: getMonthAndYearDateString(month),
    color: chartColors[i % chartColors.length] ?? "gray.6",
  }));

interface ChartData {
  date: Date;
  dateString: string;
  [key: string]: number | Date | string;
}

/**
 * Builds data for an account balance chart based on provided balances and date range.
 *
 * @param balances An array of IBalance objects representing account balances.
 * @param startDate The start date for the chart data.
 * @param endDate The end date for the chart data.
 * @param invertData Optional. If true, inverts the balance data (e.g., for representing expenses as negative values). Defaults to false.
 * @returns An array of objects, where each object represents a date and the corresponding balance for each account on that date.
 */
export const buildAccountBalanceChartData = (
  balances: IBalance[],
  invertData = false
) => {
  const sortedBalances = balances.sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  const accountIdToSortedBalancesMap = Map.groupBy(
    sortedBalances,
    (balance: IBalance) => balance.accountID
  );

  // When multiple accounts are selected, some dates might not be represented on all accounts.
  // We need to aggregate all dates that have an associated balance for at least one account.
  const distinctSortedBalanceDates: Date[] = getDistinctDates(
    getSortedBalanceDates(balances)
  );

  const chartData: ChartData[] = [];

  distinctSortedBalanceDates.forEach((date: Date, index: number) => {
    // TODO: This is a hack to get around charts not liking non-string keys.
    // It works with shadcn, so need to figure out how to make it work here.
    const dateString = date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });

    const chartDataPoint: ChartData = { date, dateString };

    accountIdToSortedBalancesMap.forEach((accountBalances, accountId) => {
      const balancesForDate = accountBalances.filter(
        (balance) =>
          getStandardDate(new Date(balance.dateTime)).getTime() ===
          getStandardDate(date).getTime()
      );

      if (balancesForDate.length > 0) {
        chartDataPoint[accountId] =
          (balancesForDate.reduce((acc, b) => acc + b.amount, 0) /
            balancesForDate.length) *
          (invertData ? -1 : 1);
      } else if (index > 0) {
        chartDataPoint[accountId] = chartData[index - 1]![accountId]!;
      } else {
        chartDataPoint[accountId] = 0;
      }
    });

    chartData.push(chartDataPoint);
  });

  return chartData;
};

export const BuildAccountBalanceChartSeries = (accounts: IAccount[]) =>
  accounts.map((account: IAccount) => {
    return {
      name: account.id,
      label: account.name,
      color:
        chartColors[accounts.indexOf(account) % chartColors.length] ?? "gray.6",
    };
  });

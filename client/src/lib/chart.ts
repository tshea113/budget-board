import { ChartConfig } from '@/components/ui/chart';
import { IBalance } from '@/types/balance';
import { getAccountBalanceMap } from './balances';
import { Account } from '@/types/account';

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
    const lineColorNumber = ((selectedAccountIds.indexOf(accountId) + 1) % 5).toString();

    chartConfig[accountId] = {
      label: account.name,
      color: `hsl(var(--chart-${lineColorNumber}))`,
    };
  });

  return chartConfig;
};

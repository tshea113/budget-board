import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import Dashboard from './dashboard';
import Transactions from '../transactions/transactions';
import Budgets from '../budget/budgets';

const Tab = (): JSX.Element => {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="mx-1 mb-2 flex w-auto">
        <TabsTrigger className="flex-grow" value="dashboard">
          Dashboard
        </TabsTrigger>
        <TabsTrigger className="flex-grow" value="transactions">
          Transactions
        </TabsTrigger>
        <TabsTrigger className="flex-grow" value="budget">
          Budget
        </TabsTrigger>
        <TabsTrigger className="flex-grow" value="trends">
          Trends
        </TabsTrigger>
      </TabsList>
      <TabsContent className="m-1" value="dashboard">
        <Dashboard />
      </TabsContent>
      <TabsContent className="m-1 flex flex-row justify-center" value="transactions">
        <Transactions />
      </TabsContent>
      <TabsContent className="m-1 flex flex-row justify-center" value="budget">
        <Budgets />
      </TabsContent>
      <TabsContent className="m-1" value="trends">
        Trends goes here!
      </TabsContent>
    </Tabs>
  );
};

export default Tab;

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from './dashboard/dashboard';
import Budgets from './budget/budgets';
import Transactions from './transactions/transactions';
import Goals from './goals/goals';

const Tab = (): JSX.Element => {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="mx-1 mb-2 flex w-auto">
        <TabsTrigger className="grow" value="dashboard">
          Dashboard
        </TabsTrigger>
        <TabsTrigger className="grow" value="transactions">
          Transactions
        </TabsTrigger>
        <TabsTrigger className="grow" value="budget">
          Budget
        </TabsTrigger>
        <TabsTrigger className="grow" value="goals">
          Goals
        </TabsTrigger>
      </TabsList>
      <TabsContent className="m-1 flex flex-row justify-center" value="dashboard">
        <Dashboard />
      </TabsContent>
      <TabsContent className="m-1 flex flex-row justify-center" value="transactions">
        <Transactions />
      </TabsContent>
      <TabsContent className="m-1 flex flex-row justify-center" value="budget">
        <Budgets />
      </TabsContent>
      <TabsContent className="m-1 flex flex-row justify-center" value="goals">
        <Goals />
      </TabsContent>
    </Tabs>
  );
};

export default Tab;

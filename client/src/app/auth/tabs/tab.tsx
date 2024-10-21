import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from './dashboard/dashboard';
import Budgets from './budget/budgets';
import Transactions from './transactions/transactions';
import Goals from './goals/goals';

const Tab = (): JSX.Element => {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="mb-2 w-full">
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
      <TabsContent value="dashboard">
        <Dashboard />
      </TabsContent>
      <TabsContent value="transactions">
        <Transactions />
      </TabsContent>
      <TabsContent value="budget">
        <Budgets />
      </TabsContent>
      <TabsContent value="goals">
        <Goals />
      </TabsContent>
    </Tabs>
  );
};

export default Tab;

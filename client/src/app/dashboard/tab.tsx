import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import Dashboard from './dashboard';
import Transactions from './transactions/transactions';

const Tab = (): JSX.Element => {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="flex w-screen">
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
      <TabsContent value="transactions">
        <Transactions />
      </TabsContent>
      <TabsContent value="budget">Budget goes here!</TabsContent>
      <TabsContent value="trends">Trends goes here!</TabsContent>
    </Tabs>
  );
};

export default Tab;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BudgetCard from './budget-card';

const Budgets = (): JSX.Element => {
  return (
    <div className="flex w-screen flex-col items-center">
      <Card className="w-full 2xl:max-w-screen-2xl">
        <CardHeader>
          <CardTitle>Budget</CardTitle>
          <CardContent className="space-y-2 pt-4">
            <BudgetCard category="Shopping" amount={23} total={100} />
            <BudgetCard category="Groceries" amount={540} total={200} />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Budgets;

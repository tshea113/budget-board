import { Card } from '@/components/ui/card';

const BudgetHeader = (): JSX.Element => {
  return (
    <Card className="my-2 space-y-1 px-3 py-1 shadow-md">
      <div className="grid grid-cols-2">
        <div>
          <h3 className="scroll-m-20 justify-self-start text-xl font-semibold tracking-tight">
            Spending
          </h3>
        </div>
        <div className="grid grid-cols-3 justify-items-center">
          <div>Spent</div>
          <div>Budget</div>
          <div>Left</div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetHeader;

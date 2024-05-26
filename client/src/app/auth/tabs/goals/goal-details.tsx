import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Account } from '@/types/account';
import { Goal } from '@/types/goal';

interface GoalDetailsProps {
  goal: Goal;
}

const GoalDetails = (props: GoalDetailsProps): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-6 p-1"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          View Details
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        <div>
          <div className="flex flex-col">
            <span className="pb-1 text-base font-semibold">Accounts</span>
            {props.goal.accounts.map((account: Account) => (
              <span className="text-sm">{account.name}</span>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GoalDetails;

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Account } from '@/types/account';
import { Goal } from '@/types/goal';

interface GoalDetailsProps {
  className?: string;
  goal: Goal;
}

const GoalDetails = (props: GoalDetailsProps): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className={cn(props.className, 'h-6 p-1')}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          View Details
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3" align="start">
        <div>
          <div className="flex flex-col">
            <span className="pb-1 text-base font-semibold">Accounts</span>
            {props.goal.accounts.map((account: Account) => (
              <span key={account.id} className="text-sm">
                {account.name}
              </span>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GoalDetails;

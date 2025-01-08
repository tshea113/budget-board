import { Button } from '@/components/ui/button';
import MonthToolcard from './month-toolcard';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react';
import { getDateFromMonthsAgo, isInArray } from '@/lib/utils';
import { useMeasure } from '@uidotdev/usehooks';
import { getCashFlowValue } from '@/lib/budgets';

interface BudgetsToolbarProps {
  selectedDates: Date[];
  setSelectedDates: (newDates: Date[]) => void;
  timeToMonthlyTotalsMap: Map<number, number>;
  showCopy: boolean;
  isPending: boolean;
  allowSelectMultiple: boolean;
}

const MonthToolCards = (props: BudgetsToolbarProps): JSX.Element => {
  const [index, setIndex] = React.useState(0);

  const [ref, { width }] = useMeasure();

  // Padding of 25 on each side and each card is roughly 70 pixels.
  const dates = Array.from({ length: Math.floor(((width ?? 0) - 72) / 68) }, (_, i) =>
    getDateFromMonthsAgo(i + index)
  );

  const handleClick = (date: Date) => {
    if (props.allowSelectMultiple) {
      // When select multiple is on, we need to add/remove selected dates when clicked.
      if (isInArray(date, props.selectedDates)) {
        // If it is present, then we need to remove it.
        props.setSelectedDates(
          props.selectedDates.filter(
            (selectedDate: Date) => selectedDate.getTime() !== date.getTime()
          )
        );
      } else {
        // If it isn't present, then add to selected.
        props.setSelectedDates([date, ...props.selectedDates]);
      }
    } else {
      // When select multiple is off, we should switch the date when clicked.
      props.setSelectedDates([date]);
    }
  };

  return (
    <div ref={ref} className="flex flex-row items-center gap-2">
      <Button
        className="h-[62px] w-8 p-1"
        variant="outline"
        onClick={() => {
          setIndex(index + 1);
        }}
      >
        <ChevronLeftIcon />
      </Button>
      <div className="flex grow flex-row-reverse justify-between">
        {dates.map((date: Date, i: number) => (
          <MonthToolcard
            key={i}
            date={date}
            isSelected={isInArray(date, props.selectedDates)}
            isPending={props.isPending}
            cashFlowValue={getCashFlowValue(props.timeToMonthlyTotalsMap, date)}
            handleClick={handleClick}
          />
        ))}
      </div>
      <Button
        className="h-[62px] w-8 p-1"
        disabled={index === 0}
        variant="outline"
        onClick={() => {
          if (index > 0) setIndex(index - 1);
        }}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};

export default MonthToolCards;

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CashFlowValue } from '@/types/budget';
import { months } from '@/types/misc';
import React, { JSX } from 'react';

interface MonthToolCardProps {
  date: Date;
  isSelected: boolean;
  isPending: boolean;
  cashFlowValue: CashFlowValue;
  handleClick: (date: Date) => void;
}

const MonthToolCard = (props: MonthToolCardProps): JSX.Element => {
  const [selectEffect, setSelectEffect] = React.useState(false);

  const toggleIsSelected = (): void => {
    setSelectEffect(true);
    props.handleClick(props.date);
  };

  const getLightColor = (cashFlowValue: CashFlowValue, isSelected: boolean): string => {
    if (isSelected) {
      switch (cashFlowValue) {
        case CashFlowValue.Positive:
          return 'bg-success';
        case CashFlowValue.Neutral:
          return 'bg-muted-foreground';
        case CashFlowValue.Negative:
          return 'bg-destructive';
      }
    }
    return 'bg-muted-foreground';
  };

  return (
    <Card
      className={cn(
        'hover:border-primary flex w-[60px] flex-col p-0.5',
        props.isSelected ? 'bg-muted' : 'bg-card',
        selectEffect && 'animate-big-pop'
      )}
      onClick={toggleIsSelected}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <div
        className={cn(
          'h-[20px] w-full rounded-lg',
          getLightColor(props.cashFlowValue, props.isSelected)
        )}
      />
      <span className="text-sm select-none">
        {months.at(props.date.getMonth())?.substring(0, 3)}
      </span>
      <span className="text-muted-foreground text-xs select-none">
        {props.date.getFullYear()}
      </span>
    </Card>
  );
};

export default MonthToolCard;

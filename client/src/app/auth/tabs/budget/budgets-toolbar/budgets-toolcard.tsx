import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { months } from '@/types/misc';
import React from 'react';

interface BudgetsToolCardProps {
  date: Date;
  isSelected: boolean;
  isNetCashflowPositive: boolean;
  handleClick: (date: Date) => void;
}

const BudgetsToolCard = (props: BudgetsToolCardProps): JSX.Element => {
  const [selectEffect, setSelectEffect] = React.useState(false);

  const toggleIsSelected = (): void => {
    setSelectEffect(true);
    props.handleClick(props.date);
  };

  return (
    <Card
      className={cn(
        'flex w-[60px] flex-col p-0.5 hover:border-primary',
        props.isSelected ? 'bg-muted' : 'bg-card',
        selectEffect && 'animate-big-pop'
      )}
      onClick={toggleIsSelected}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <Card
        className={cn(
          'h-[20px] w-full',
          props.isNetCashflowPositive ? 'bg-success' : 'bg-destructive'
        )}
      />
      <span className="text-sm">{months.at(props.date.getMonth())?.substring(0, 3)}</span>
      {props.date.getMonth() === 0 || props.date.getMonth() === 11 ? (
        <span className="text-xs text-muted-foreground">{props.date.getFullYear()}</span>
      ) : (
        <div className="h-[16px]" />
      )}
    </Card>
  );
};

export default BudgetsToolCard;

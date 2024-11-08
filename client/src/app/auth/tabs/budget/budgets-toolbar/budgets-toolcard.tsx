import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

interface BudgetsToolCardProps {
  date: Date;
  underBudget: boolean;
}
const BudgetsToolCard = (props: BudgetsToolCardProps): JSX.Element => {
  const [isSelected, setIsSelected] = React.useState(false);
  const [selectEffect, setSelectEffect] = React.useState(false);

  const months = [...Array(12).keys()].map((key) =>
    new Date(0, key).toLocaleString('en', { month: 'long' })
  );

  const toggleIsSelected = (): void => {
    setIsSelected(!isSelected);
    setSelectEffect(true);
  };

  return (
    <Card
      className={cn(
        'flex w-[70px] flex-col p-0.5 hover:bg-muted',
        isSelected ? 'bg-muted' : 'bg-card',
        selectEffect && 'animate-big-pop'
      )}
      onClick={toggleIsSelected}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <Card
        className={cn(
          'h-[20px] w-full',
          props.underBudget ? 'bg-success' : 'bg-destructive'
        )}
      />
      <span>{months.at(props.date.getMonth())?.substring(0, 3)}</span>
      {props.date.getMonth() === 0 || props.date.getMonth() === 11 ? (
        <span className="text-xs text-muted-foreground">{props.date.getFullYear()}</span>
      ) : (
        <div className="h-[16px]" />
      )}
    </Card>
  );
};

export default BudgetsToolCard;

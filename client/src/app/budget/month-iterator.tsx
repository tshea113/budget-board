import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react';

interface MonthIteratorProps {
  date: Date;
  setDate: (date: Date) => void;
}

const MonthIterator = ({ date, setDate }: MonthIteratorProps): JSX.Element => {
  const translateDate = (date: Date): string => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const [displayDate, setDisplayDate] = React.useState<string>(translateDate(date));

  const iterateDate = (iterate: number): void => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + iterate);
    setDate(newDate);
  };

  React.useEffect(() => {
    setDisplayDate(translateDate(date));
  }, [date]);

  return (
    <div className="flex flex-row items-center justify-center space-x-2">
      <Button
        className="p-2"
        variant="ghost"
        onClick={() => {
          iterateDate(-1);
        }}
      >
        <ChevronLeftIcon />
      </Button>
      <div className="text-lg font-semibold">{displayDate}</div>
      <Button
        className="p-2"
        variant="ghost"
        onClick={() => {
          iterateDate(1);
        }}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};

export default MonthIterator;

import { CalendarIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const DatePicker = ({ value, onChange }: { value: Date; onChange: () => void }): JSX.Element => {
  const [date, setDate] = React.useState<any>(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'min-w-[200px] max-w-full justify-start text-left font-normal',
            date == null && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date != null ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onDayClick={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerWithRangeProps {
  className?: string;
  value?: DateRange;
  startMonth?: Date;
  endMonth?: Date;
  onSelect?: (dateRange: DateRange) => void;
}

const DatePickerWithRange = (props: DatePickerWithRangeProps): JSX.Element => {
  return (
    <div className={cn('grid gap-2', props.className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'flex w-[300px] flex-row justify-start gap-2 text-left font-normal',
              !props.value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {props.value?.from ? (
              props.value?.to ? (
                <>
                  {format(props.value?.from, 'LLL dd, y')} -{' '}
                  {format(props.value?.to, 'LLL dd, y')}
                </>
              ) : (
                format(props.value?.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={props.value}
            onSelect={props.onSelect}
            defaultMonth={props.value?.from ?? new Date()}
            autoFocus
            startMonth={
              props.startMonth ??
              new Date(
                props.value
                  ? new Date(props.value?.from ?? '').getFullYear() - 100
                  : new Date().getFullYear() - 100,
                props.value
                  ? new Date(props.value?.from ?? '').getMonth()
                  : new Date().getMonth()
              )
            }
            endMonth={
              props.endMonth ??
              new Date(
                props.value
                  ? new Date(props.value?.to ?? '').getFullYear() + 100
                  : new Date().getFullYear() + 100,
                props.value
                  ? new Date(props.value?.to ?? '').getMonth()
                  : new Date().getMonth()
              )
            }
            required
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;

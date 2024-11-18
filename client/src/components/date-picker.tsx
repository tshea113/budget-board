import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  className?: string;
  value?: Date;
  startMonth?: Date;
  endMonth?: Date;
  onDayClick?: (day: Date) => void;
  onDayBlur?: (day: Date) => void;
}

const DatePicker = (props: DatePickerProps): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            props.className,
            'min-w-[50px] max-w-full justify-start text-left font-normal',
            !props.value && 'text-muted-foreground'
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.value ? format(props.value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.value}
          onDayClick={props.onDayClick}
          onDayBlur={props.onDayBlur}
          autoFocus
          startMonth={
            props.startMonth ??
            new Date(
              props.value
                ? new Date(props.value).getFullYear() - 100
                : new Date().getFullYear() - 100,
              props.value ? new Date(props.value).getMonth() : new Date().getMonth()
            )
          }
          endMonth={
            props.endMonth ??
            new Date(
              props.value
                ? new Date(props.value).getFullYear() + 100
                : new Date().getFullYear() + 100,
              props.value ? new Date(props.value).getMonth() : new Date().getMonth()
            )
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;

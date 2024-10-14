import { CalendarIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DatePickerProps {
  className?: string;
  value: Date;
  fromYear?: number;
  toYear?: number;
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
            props.value == null && 'text-muted-foreground'
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.value != null ? format(props.value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={props.value}
          defaultMonth={props.value}
          onDayClick={props.onDayClick}
          onDayBlur={props.onDayBlur}
          initialFocus
          fromYear={props.fromYear ?? new Date(props.value).getFullYear() - 50}
          toYear={props.toYear ?? new Date(props.value).getFullYear() + 50}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;

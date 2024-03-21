import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type Category, categories } from '@/types/transaction';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';

interface CategoryInputProps {
  initialValue: string;
  onSelectChange: (category: string) => void;
}

const CategoryInput = ({ ...props }: CategoryInputProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(props.initialValue ?? '');
  }, [props.initialValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value.length > 0
            ? categories.find((category) => category.value === value)?.label
            : 'Select category...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search categories" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category: Category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    props.onSelectChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === category.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryInput;

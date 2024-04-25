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
import { getCategoriesAsTree } from '@/lib/transactions';
import { cn } from '@/lib/utils';
import { categories, type Category } from '@/types/transaction';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';
import CommandSubcategory from '../dashboard/command-subcategory';

interface CategoryInputProps {
  initialValue: string;
  onSelectChange: (category: string) => void;
}

const CategoryInput = (props: CategoryInputProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(props.initialValue);

  const categoriesTree = getCategoriesAsTree();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="dropdown"
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
      <PopoverContent className="w-[225px] p-0">
        <Command>
          <CommandInput placeholder="Search categories" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            {categoriesTree.map((category: Category) => (
              <CommandGroup key={category.value}>
                <CommandItem
                  className="font-bold"
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
                <CommandSubcategory
                  category={category}
                  initialValue={value}
                  updateValue={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    props.onSelectChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                />
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryInput;

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
import { areStringsEqual, cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';
import CommandSubcategory from './command-subcategory';
import { ICategory, ICategoryNode } from '@/types/category';
import { buildCategoriesTree, getFormattedCategoryValue } from '@/lib/category';

interface CategoryInputProps {
  className?: string;
  initialValue: string;
  categories: ICategory[];
  onSelectChange: (category: string) => void;
}

const CategoryInput = (props: CategoryInputProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(props.initialValue ?? '');

  return (
    <div className={props.className ?? ''}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="dropdown"
            role="combobox"
            aria-expanded={open}
            className="w-full min-w-[50px] max-w-full justify-between bg-card hover:bg-secondary hover:text-secondary-foreground"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {value.length > 0
              ? getFormattedCategoryValue(value, props.categories)
              : 'Select category...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[225px] p-0">
          <Command>
            <CommandInput
              placeholder="Search categories"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              {buildCategoriesTree(props.categories).map((category: ICategoryNode) => (
                <CommandGroup
                  key={category.value}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
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
                        areStringsEqual(value, category.value)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {category.value}
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
    </div>
  );
};

export default CategoryInput;

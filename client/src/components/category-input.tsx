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
import React, { JSX } from 'react';
import CommandSubcategory from './command-subcategory';
import { ICategory, ICategoryNode } from '@/types/category';
import { buildCategoriesTree, getFormattedCategoryValue } from '@/lib/category';

interface CategoryInputProps {
  className?: string;
  categories: ICategory[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  parentsOnly?: boolean;
}

const CategoryInput = (props: CategoryInputProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={props.className ?? ''}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="dropdown"
            role="combobox"
            aria-expanded={open}
            className="hover:bg-accent hover:text-accent-foreground w-full max-w-full min-w-[50px] justify-between"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {props.selectedCategory.length > 0
              ? getFormattedCategoryValue(props.selectedCategory, props.categories)
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
                    className={cn(props.parentsOnly ? '' : 'font-bold')}
                    value={category.value}
                    onSelect={(currentValue) => {
                      props.setSelectedCategory(
                        areStringsEqual(currentValue, props.selectedCategory)
                          ? ''
                          : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        areStringsEqual(props.selectedCategory, category.value)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {category.value}
                  </CommandItem>
                  {!props.parentsOnly && (
                    <CommandSubcategory
                      category={category}
                      selectedCategory={props.selectedCategory}
                      setSelectedCategory={(currentValue: string) => {
                        props.setSelectedCategory(
                          currentValue === props.selectedCategory ? '' : currentValue
                        );
                        setOpen(false);
                      }}
                    />
                  )}
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

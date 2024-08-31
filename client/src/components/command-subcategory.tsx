import { CommandItem } from '@/components/ui/command';
import { areStringsEqual, cn } from '@/lib/utils';
import { ICategoryNode } from '@/types/category';
import { Check } from 'lucide-react';
import React from 'react';

interface CommandSubcategoryProps {
  category: ICategoryNode;
  initialValue: string;
  updateValue: (newValue: string) => void;
}

const CommandSubcategory = ({
  category,
  initialValue,
  updateValue,
}: CommandSubcategoryProps): JSX.Element => {
  const [value, setValue] = React.useState(initialValue);

  const onSelect = (newValue: string): void => {
    setValue(newValue);
    updateValue(newValue);
  };

  return (
    <>
      {category.subCategories.map((subCategory) => (
        <CommandItem
          key={subCategory.value}
          value={subCategory.value}
          onSelect={onSelect}
        >
          <Check
            className={cn(
              'mr-8 h-4 w-4',
              areStringsEqual(value, subCategory.value) ? 'opacity-100' : 'opacity-0'
            )}
          />
          {subCategory.value}
        </CommandItem>
      ))}
    </>
  );
};

export default CommandSubcategory;

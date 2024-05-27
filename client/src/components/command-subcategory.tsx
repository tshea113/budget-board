import { CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Category } from '@/types/category';
import { Check } from 'lucide-react';
import React from 'react';

interface CommandSubcategoryProps {
  category: Category;
  initialValue: string;
  updateValue: (newValue: string) => void;
}

const CommandSubcategory = ({
  category,
  initialValue,
  updateValue,
}: CommandSubcategoryProps): JSX.Element => {
  const [value, setValue] = React.useState(initialValue);
  const subCategories = category.subCategories ?? [];

  const onSelect = (newValue: string): void => {
    setValue(newValue);
    updateValue(newValue);
  };

  const subCategoriesList = subCategories.map((subCategory) => (
    <CommandItem key={subCategory.label} value={subCategory.value} onSelect={onSelect}>
      <Check
        className={cn('mr-8 h-4 w-4', value === subCategory.value ? 'opacity-100' : 'opacity-0')}
      />
      {subCategory.label}
    </CommandItem>
  ));

  return <>{subCategoriesList}</>;
};

export default CommandSubcategory;

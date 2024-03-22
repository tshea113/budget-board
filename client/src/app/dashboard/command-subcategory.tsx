import { CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { type Category } from '@/types/transaction';
import { Check } from 'lucide-react';
import React from 'react';

interface CommandSubcategoryProps {
  category: Category;
  updateValue: (newValue: string) => void;
}

const CommandSubcategory = ({ category, updateValue }: CommandSubcategoryProps): JSX.Element => {
  const [value, setValue] = React.useState('');
  const subCategories = category.subCategories ?? [];

  const onSelect = (newValue: string): void => {
    setValue(newValue);
    updateValue(newValue);
  };

  const subCategoriesList = subCategories.map((subCategory) => (
    <CommandItem key={subCategory.label} value={subCategory.value} onSelect={onSelect}>
      <Check
        className={cn('mr-8 h-4 w-4', value === category.value ? 'opacity-100' : 'opacity-0')}
      />
      {subCategory.label}
    </CommandItem>
  ));

  return <>{subCategoriesList}</>;
};

export default CommandSubcategory;

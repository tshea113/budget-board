import { CommandItem } from '@/components/ui/command';
import { areStringsEqual, cn } from '@/lib/utils';
import { ICategory, ICategoryNode } from '@/types/category';
import { Check } from 'lucide-react';

interface CommandSubcategoryProps {
  category: ICategoryNode;
  selectedCategory: string;
  setSelectedCategory: (newValue: string) => void;
}

const CommandSubcategory = (props: CommandSubcategoryProps): JSX.Element => {
  return (
    <>
      {props.category.subCategories.map((subCategory: ICategory) => (
        <CommandItem
          key={subCategory.value}
          value={subCategory.value}
          onSelect={props.setSelectedCategory}
        >
          <Check
            className={cn(
              'mr-8 h-4 w-4',
              areStringsEqual(props.selectedCategory, subCategory.value)
                ? 'opacity-100'
                : 'opacity-0'
            )}
          />
          {subCategory.value}
        </CommandItem>
      ))}
    </>
  );
};

export default CommandSubcategory;

import { categories as constantCategories, Category } from '@/types/category';

export const getCategories = (customCategories: Category[]): Category[] => {
  return constantCategories.concat(customCategories);
};

export const getCategoryLabel = (
  categories: Category[],
  categoryValue: string
): string | null => {
  const foundCategory = categories.find((c) => c.value === categoryValue);
  return foundCategory?.label ?? null;
};

export const getCategoriesAsTree = (categories: Category[]): Category[] => {
  const map: Record<string, number> = {};
  let node: Category;
  const roots: Category[] = [];

  for (let i = 0; i < categories.length; i++) {
    map[categories[i].value] = i; // initialize the map
    categories[i].subCategories = []; // initialize the children
  }

  for (let i = 0; i < categories.length; i++) {
    node = categories[i];
    if (node.parent !== '') {
      // if you have dangling branches check that map[node.parentId] exists
      categories[map[node.parent]].subCategories?.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
};

export const getParentCategory = (
  categories: Category[],
  categoryValue: string
): string => {
  const category = categories.find((c) => c.value === categoryValue);

  if (category == null) return '';

  return category.parent === '' ? category.value : category.parent;
};

export const getIsCategory = (categories: Category[], categoryValue: string): boolean => {
  return categories.find((c) => c.value === categoryValue)?.parent === '';
};

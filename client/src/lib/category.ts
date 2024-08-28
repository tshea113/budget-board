import { ICategory, CategoryNode } from '@/types/category';
import { areStringsEqual } from './utils';

/**
 * Builds a tree of category nodes and their children
 * @param categories The array of category data
 * @returns An array of CategoryNode which each contain an array of its children.
 */
export const buildCategoriesTree = (categories: ICategory[]): CategoryNode[] => {
  const roots: CategoryNode[] = [];

  // Push all the parent nodes to the roots array
  categories
    .filter((c) => c.parent.length === 0)
    .forEach((parent) => {
      roots.push(new CategoryNode(parent));
    });

  // Populate the children branches for each parent root node
  categories
    .filter((c) => c.parent.length !== 0)
    .forEach((category) => {
      const parent: CategoryNode | undefined = roots.find((c) =>
        areStringsEqual(c.value, category.parent)
      );

      if (parent) {
        parent.subCategories.push(new CategoryNode(category));
      }
    });

  return roots;
};

/**
 * Gets the formatted category value from an unformatted category value string.
 * @param categoryString String value of category, ignoring any case or accent marks
 * @param categories The array of category data
 * @returns Formatted category value
 */
export const getFormattedCategoryValue = (
  categoryString: string,
  categories: ICategory[]
): string => {
  const foundCategory = categories.find((c) => areStringsEqual(c.value, categoryString));

  return foundCategory?.value ?? '';
};

/**
 * Gets the parent of a given category value. Returns itself if it has no parent.
 * @param categoryValue String value of category, ignoring any case or accent marks
 * @param categories The array of category data
 * @returns Formatted category value of parent
 */
export const getParentCategory = (
  categoryValue: string,
  categories: ICategory[]
): string => {
  const category = categories.find((c) => areStringsEqual(c.value, categoryValue));

  if (category == null) return '';

  return category.parent === '' ? category.value : category.parent;
};

/**
 * Checks if the category value is a top-level category
 * @param categoryValue String value of category, ignoring any case or accent marks
 * @returns True if it is a top-level category, false otherwise
 */
export const getIsParentCategory = (
  categoryValue: string,
  categories: ICategory[]
): boolean => {
  return (
    categories.find((c) => areStringsEqual(c.value, categoryValue))?.parent.length === 0
  );
};

import { CategoryNode, ICategory } from "@models/category";
import { areStringsEqual } from "./utils";

/**
 * Builds an alphabetized tree of category nodes and their children
 * @param categories The array of category data
 * @returns An array of CategoryNode which each contain an array of its children.
 */
export const buildCategoriesTree = (
  categories: ICategory[]
): CategoryNode[] => {
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

  roots.sort((a, b) =>
    a.value.toLocaleLowerCase().localeCompare(b.value.toLocaleLowerCase())
  );

  return roots;
};

/**
 * Searches the given categories for a category matching the provided string.
 * If a matching category is found, returns its value; otherwise returns "Uncategorized".
 *
 * The comparison is case-insensitive, leveraging the utility function areStringsEqual.
 *
 * @param {string} categoryString - The category to look up in the categories array.
 * @param {ICategory[]} categories - The array of category objects.
 * @returns {string} The matching category's value, or "Uncategorized" if no match is found.
 */
export const getFormattedCategoryValue = (
  categoryString: string,
  categories: ICategory[]
): string => {
  const foundCategory = categories.find((c) =>
    areStringsEqual(c.value, categoryString)
  );

  return foundCategory?.value ?? "Uncategorized";
};

import SortButton, { SortDirection } from './sort-button';

export enum Sorts {
  Date,
  Merchant,
  Category,
  Amount,
}

interface SortOption {
  value: Sorts;
  label: string;
}

const sortOptions: SortOption[] = [
  {
    value: Sorts.Date,
    label: 'Date',
  },
  {
    value: Sorts.Merchant,
    label: 'Merchant',
  },
  {
    value: Sorts.Category,
    label: 'Category',
  },
  {
    value: Sorts.Amount,
    label: 'Amount',
  },
];

interface SortByMenuProps {
  currentSort: Sorts;
  setCurrentSort: (newCurrentSort: Sorts) => void;
  sortDirection: SortDirection;
  setSortDirection: (newSortDirection: SortDirection) => void;
}

const SortByMenu = (props: SortByMenuProps): JSX.Element => {
  const ToggleSortDirection = (sortDirection: SortDirection): SortDirection => {
    switch (sortDirection) {
      case SortDirection.None:
        return SortDirection.Ascending;
      case SortDirection.Ascending:
        return SortDirection.Decending;
      case SortDirection.Decending:
        return SortDirection.Ascending;
    }
  };

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      <label>Sort By</label>
      {sortOptions.map((sortOption: SortOption) => (
        <SortButton
          key={sortOption.value}
          label={sortOption.label}
          sortDirection={
            sortOption.value === props.currentSort
              ? props.sortDirection
              : SortDirection.None
          }
          onClick={() => {
            if (sortOption.value != props.currentSort) {
              // When selecting a new sort option, should always go to decending.
              props.setSortDirection(SortDirection.Decending);
            } else {
              props.setSortDirection(ToggleSortDirection(props.sortDirection));
            }
            props.setCurrentSort(sortOption.value);
          }}
        />
      ))}
    </div>
  );
};

export default SortByMenu;

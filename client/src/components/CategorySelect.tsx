import { Combobox, ComboboxStore, Input, InputBase, Text } from "@mantine/core";
import { ICategory } from "@models/category";
import React from "react";

interface CategorySelectProps {
  combobox: ComboboxStore;
  label?: string;
  categories: ICategory[];
}

const CategorySelect = (props: CategorySelectProps): React.ReactNode => {
  const [value, setValue] = React.useState<string | null>(null);

  const options = props.categories.map((category) => (
    <Combobox.Option key={category.value} value={category.value}>
      <Text fz={20}>{category.value}</Text>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={props.combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        props.combobox.closeDropdown();
      }}
      zIndex={2000}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => props.combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          {value ? (
            <Text fz={20}>{value}</Text>
          ) : (
            <Input.Placeholder>Pick value</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default CategorySelect;

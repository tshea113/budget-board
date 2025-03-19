import { getIsParentCategory } from "@helpers/category";
import { areStringsEqual } from "@helpers/utils";
import {
  CheckIcon,
  Combobox,
  Group,
  Input,
  InputBase,
  StyleProp,
  Text,
  useCombobox,
} from "@mantine/core";
import { ICategory } from "@models/category";
import React from "react";

interface CategorySelectProps {
  w?: StyleProp<React.CSSProperties["width"]>;
  categories: ICategory[];
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}

const CategorySelect = (props: CategorySelectProps): React.ReactNode => {
  const [search, setSearch] = React.useState("");

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.focusTarget();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const options = props.categories
    .filter((item) =>
      item.value.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((category) => (
      <Combobox.Option
        key={category.value}
        value={category.value}
        active={category.value === props.value}
      >
        <Group gap="0.5rem">
          {areStringsEqual(category.value, props.value) ? (
            <CheckIcon size={12} />
          ) : (
            <div style={{ width: 12 }} />
          )}
          <Text
            fz="sm"
            style={{
              fontWeight: getIsParentCategory(category.value, props.categories)
                ? 700
                : 400,
              textWrap: "nowrap",
            }}
            pl={getIsParentCategory(category.value, props.categories) ? 0 : 10}
          >
            {category.value}
          </Text>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        if (areStringsEqual(val, props.value)) {
          props.onChange("");
        } else {
          props.onChange(val);
        }
        combobox.closeDropdown();
      }}
      withinPortal={false}
    >
      <Combobox.Target>
        <InputBase
          w={props.w}
          miw="max-content"
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          {props.value ? (
            <Text fz="sm">{props.value}</Text>
          ) : (
            <Input.Placeholder>Pick value</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown miw="max-content">
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search Categories"
          size="sm"
        />
        <Combobox.Options mah={300} style={{ overflowY: "auto" }}>
          {options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default CategorySelect;

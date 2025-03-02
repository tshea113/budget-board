import { AuthContext } from "@components/auth/AuthProvider";
import SortableHandle from "@components/Sortable/SortableHandle";
import SortableItem from "@components/Sortable/SortableItem";
import { translateAxiosError } from "@helpers/requests";
import {
  Button,
  Card,
  Checkbox,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  accountCategories,
  IAccount,
  IAccountUpdateRequest,
} from "@models/account";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GripVertical } from "lucide-react";
import React from "react";
import DeleteAccountPopover from "./DeleteAccountPopover";

interface AccountSettingsCardProps {
  account: IAccount;
  isSortable: boolean;
}

const AccountSettingsCard = (
  props: AccountSettingsCardProps
): React.ReactNode => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [accountName, setAccountName] = React.useState(props.account.name);
  const [accountType, _setAccountType] = React.useState(props.account.type);
  const [accountSubType, _setAccountSubType] = React.useState(
    props.account.subtype
  );
  const [accountHideAccount, setAccountHideAccount] = React.useState(
    props.account.hideAccount
  );
  const [accountHideTransactions, setAccountHideTransactions] = React.useState(
    props.account.hideTransactions
  );

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();

  const doUpdateAccount = useMutation({
    mutationFn: async () => {
      const editedAccount: IAccountUpdateRequest = {
        id: props.account.id,
        name: accountName,
        type: accountType,
        subtype: accountSubType,
        hideTransactions: accountHideTransactions,
        hideAccount: accountHideAccount,
      };

      return await request({
        url: "/api/account",
        method: "PUT",
        data: editedAccount,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      await queryClient.invalidateQueries({ queryKey: ["institutions"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: AxiosError) => {
      notifications.show({ color: "red", message: translateAxiosError(error) });
    },
  });

  useDidUpdate(
    () => doUpdateAccount.mutate(),
    [accountType, accountSubType, accountHideAccount, accountHideTransactions]
  );

  return (
    <SortableItem value={props.account.id}>
      <Card radius="lg">
        <LoadingOverlay visible={doUpdateAccount.isPending} />
        <Group justify="space-between" align="center" wrap="nowrap">
          {props.isSortable && (
            <SortableHandle style={{ alignSelf: "stretch" }}>
              <Button h="100%" px={0} w={30} radius="lg">
                <GripVertical size={25} />
              </Button>
            </SortableHandle>
          )}
          <Flex
            display="flex"
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            w="100%"
            gap={15}
          >
            <Flex
              display="flex"
              direction={{ base: "column", sm: "row" }}
              align="center"
              justify="space-between"
              w="100%"
              gap={10}
            >
              <TextInput
                w="100%"
                label="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.currentTarget.value)}
                onBlur={() => doUpdateAccount.mutate()}
              />
              {/* TODO: Create component for parent child categories */}
              <Select
                label="Category"
                data={accountCategories.map((c) => c.value)}
              />
            </Flex>
            <Flex
              display="flex"
              direction={{ base: "column", sm: "row" }}
              align="center"
              justify="space-between"
              w="100%"
              gap={10}
            >
              <Checkbox
                label="Hide Account?"
                checked={accountHideAccount}
                onChange={(e) => {
                  setAccountHideAccount(e.currentTarget.checked);
                }}
              />
              <Checkbox
                label="Hide Transactions?"
                checked={accountHideTransactions}
                onChange={(e) =>
                  setAccountHideTransactions(e.currentTarget.checked)
                }
              />
              <DeleteAccountPopover accountId={props.account.id} />
            </Flex>
          </Flex>
        </Group>
      </Card>
    </SortableItem>
  );
};

export default AccountSettingsCard;

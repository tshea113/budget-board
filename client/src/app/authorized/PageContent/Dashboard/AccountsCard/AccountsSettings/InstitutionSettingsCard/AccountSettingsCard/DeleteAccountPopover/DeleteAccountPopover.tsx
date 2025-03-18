import { AuthContext } from "@components/Auth/AuthProvider";
import { translateAxiosError } from "@helpers/requests";
import { ActionIcon, Button, Checkbox, Popover, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import React from "react";

interface DeleteAccountPopoverProps {
  accountId: string;
}

const DeleteAccountPopover = (
  props: DeleteAccountPopoverProps
): React.ReactNode => {
  const [deleteTransactions, { toggle }] = useDisclosure(false);

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();

  const doDeleteAccount = useMutation({
    mutationFn: async (deleteTransactions: boolean) =>
      await request({
        url: "/api/account",
        method: "DELETE",
        params: { guid: props.accountId, deleteTransactions },
      }),
    onSuccess: async () => {
      // Refetch the accounts and institutions queries immediatly after the account is deleted
      await queryClient.refetchQueries({ queryKey: ["institutions"] });
      await queryClient.refetchQueries({ queryKey: ["accounts"] });
    },
    onError: (error: AxiosError) => {
      notifications.show({ color: "red", message: translateAxiosError(error) });
    },
  });
  return (
    <Popover>
      <Popover.Target>
        <ActionIcon
          w={{ base: "100%", sm: "auto" }}
          onClick={() => doDeleteAccount.mutate(deleteTransactions)}
          color="red"
        >
          <TrashIcon size={20} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap={10}>
          <Checkbox
            checked={deleteTransactions}
            onChange={toggle}
            label="Delete Transactions?"
          />
          <Button
            color="red"
            loading={doDeleteAccount.isPending}
            onClick={() => doDeleteAccount.mutate(deleteTransactions)}
          >
            Delete
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DeleteAccountPopover;

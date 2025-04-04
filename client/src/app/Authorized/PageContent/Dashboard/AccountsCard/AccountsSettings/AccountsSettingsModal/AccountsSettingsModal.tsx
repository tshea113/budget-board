import { Button, Group, Modal, Stack } from "@mantine/core";
import React from "react";
import DeletedAccounts from "./DeletedAccounts/DeletedAccounts";
import { IAccount } from "~/models/account";
import InstitutionSettingsCard from "./InstitutionSettingsCard/InstitutionSettingsCard";
import { IInstitution, InstitutionIndexRequest } from "~/models/institution";
import { useDisclosure } from "@mantine/hooks";
import Sortable from "~/components/Sortable/Sortable";
import { AuthContext } from "~/components/AuthProvider/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { translateAxiosError } from "~/helpers/requests";
import { AxiosError } from "axios";

interface AccountsSettingsProps<T extends string> {
  opened: boolean;
  onClose: () => void;
  stackId: T;
  sortedFilteredInstitutions: IInstitution[];
  accounts: IAccount[];
}

const AccountsSettingsModal = <T extends string>(
  props: AccountsSettingsProps<T>
): React.ReactNode => {
  const [sortedInstitutions, setSortedInstitutions] = React.useState<
    IInstitution[]
  >(props.sortedFilteredInstitutions);
  const [isSortable, { toggle }] = useDisclosure(false);

  React.useEffect(() => {
    setSortedInstitutions(
      props.sortedFilteredInstitutions.sort((a, b) => a.index - b.index)
    );
  }, [props.sortedFilteredInstitutions]);

  const { request } = React.useContext<any>(AuthContext);
  const queryClient = useQueryClient();
  const doIndexInstitutions = useMutation({
    mutationFn: async (institutions: InstitutionIndexRequest[]) =>
      await request({
        url: "/api/institution/setindices",
        method: "PUT",
        data: institutions,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toggle();
    },
    onError: (error: AxiosError) =>
      notifications.show({ color: "red", message: translateAxiosError(error) }),
  });

  const onReorderClick = () => {
    if (isSortable) {
      const indexedInstitutions: InstitutionIndexRequest[] =
        sortedInstitutions.map((inst, index) => ({
          id: inst.id,
          index,
        }));
      doIndexInstitutions.mutate(indexedInstitutions);
    } else {
      toggle();
    }
  };

  return (
    <Modal
      size="100rem"
      centered
      opened={props.opened}
      onClose={props.onClose}
      stackId={props.stackId}
      title="Accounts Settings"
    >
      <Stack gap={20}>
        <Group w="100%" gap={10} justify="space-between">
          <Button w="49%">Create Account</Button>
          <Button
            w="49%"
            onClick={onReorderClick}
            color={isSortable ? "green" : ""}
            loading={doIndexInstitutions.isPending}
          >
            {isSortable ? "Save Changes" : "Reorder"}
          </Button>
        </Group>
        <Stack gap={10}>
          <Sortable
            values={sortedInstitutions}
            onMove={({ activeIndex: from, overIndex: to }) => {
              const newInstitutions = [...sortedInstitutions];
              const [movedInstitution] = newInstitutions.splice(from, 1);
              if (movedInstitution === undefined) {
                return;
              }
              newInstitutions.splice(to, 0, movedInstitution);
              setSortedInstitutions(newInstitutions);
            }}
          >
            {sortedInstitutions.map((institution) => (
              <InstitutionSettingsCard
                key={institution.id}
                institution={institution}
                isSortable={isSortable}
              />
            ))}
          </Sortable>
        </Stack>
        <DeletedAccounts
          deletedAccounts={props.accounts.filter(
            (a: IAccount) => a.deleted !== null
          )}
        />
      </Stack>
    </Modal>
  );
};

export default AccountsSettingsModal;

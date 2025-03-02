import { Button, Modal, Stack } from "@mantine/core";
import React from "react";
import DeletedAccounts from "./DeletedAccounts/DeletedAccounts";
import { IAccount } from "@models/account";
import InstitutionSettingsCard from "./InstitutionSettingsCard/InstitutionSettingsCard";
import { IInstitution, InstitutionIndexRequest } from "@models/institution";
import { useDisclosure } from "@mantine/hooks";
import Sortable from "@components/Sortable/Sortable";
import { AuthContext } from "@components/auth/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { translateAxiosError } from "@helpers/requests";
import { AxiosError } from "axios";

interface AccountsSettingsProps {
  modalOpened: boolean;
  closeModal: () => void;
  institutions: IInstitution[];
  accounts: IAccount[];
}

const AccountsSettings = (props: AccountsSettingsProps): React.ReactNode => {
  const [sortedInstitutions, setSortedInstitutions] = React.useState<
    IInstitution[]
  >(props.institutions.sort((a, b) => a.index - b.index));
  const [isSortable, { toggle }] = useDisclosure(false);

  React.useEffect(() => {
    setSortedInstitutions(props.institutions.sort((a, b) => a.index - b.index));
  }, [props.institutions]);

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
      opened={props.modalOpened}
      onClose={props.closeModal}
      title="Accounts Settings"
    >
      <Stack gap={20}>
        <Button
          onClick={onReorderClick}
          color={isSortable ? "green" : ""}
          loading={doIndexInstitutions.isPending}
        >
          {isSortable ? "Save Changes" : "Reorder"}
        </Button>
        <Stack gap={10}>
          <Sortable
            values={sortedInstitutions}
            onMove={({ activeIndex: from, overIndex: to }) => {
              const newInstitutions = [...sortedInstitutions];
              const [movedInstitution] = newInstitutions.splice(from, 1);
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

export default AccountsSettings;

import classes from "./AccountsSettings.module.css";

import { ActionIcon, useModalsStack } from "@mantine/core";
import { SettingsIcon } from "lucide-react";
import React from "react";
import AccountsSettingsModal from "./AccountsSettingsModal/AccountsSettingsModal";
import { IInstitution } from "~/models/institution";
import { IAccount } from "~/models/account";

interface AccountsSettingsProps {
  sortedFilteredInstitutions: IInstitution[];
  accounts: IAccount[];
}

const AccountsSettings = (props: AccountsSettingsProps): React.ReactNode => {
  const stack = useModalsStack(["settings"]);

  return (
    <>
      <ActionIcon
        className={classes.settingsIcon}
        variant="subtle"
        onClick={() => stack.open("settings")}
      >
        <SettingsIcon />
      </ActionIcon>
      <AccountsSettingsModal
        sortedFilteredInstitutions={props.sortedFilteredInstitutions}
        accounts={props.accounts}
        {...stack.register("settings")}
      />
    </>
  );
};
export default AccountsSettings;

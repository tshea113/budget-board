import LinkSimpleFin from './link-simplefin';
import ResetPassword from './reset-password';
import DarkModeToggle from './dark-mode-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';

const AccountSettings = (): JSX.Element => {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-xl font-semibold tracking-tight">Account Settings</span>
        <span className="text-sm text-gray-500">Make changes to your account here.</span>
      </div>
      <ScrollArea className="h-full pr-3" type="auto">
        <div className="flex flex-col gap-3">
          <DarkModeToggle />
          <LinkSimpleFin />
          <ResetPassword />
        </div>
      </ScrollArea>
    </div>
  );
};

export default AccountSettings;

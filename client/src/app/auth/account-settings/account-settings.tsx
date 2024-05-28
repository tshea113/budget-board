import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import LinkSimpleFin from './link-simplefin';
import ResetPassword from './reset-password';
import DarkModeToggle from './dark-mode-toggle';

const AccountSettings = (): JSX.Element => {
  return (
    <div className="space-y-4">
      <SheetHeader>
        <SheetTitle>Account</SheetTitle>
        <SheetDescription>Make changes to your account here.</SheetDescription>
      </SheetHeader>
      <DarkModeToggle />
      <LinkSimpleFin />
      <ResetPassword />
    </div>
  );
};

export default AccountSettings;

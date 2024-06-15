import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import LinkSimpleFin from './link-simplefin';
import ResetPassword from './reset-password';
import DarkModeToggle from './dark-mode-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';

const AccountSettings = (): JSX.Element => {
  return (
    <div className="h-full space-y-4">
      <ScrollArea className="h-full">
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
          <SheetDescription>Make changes to your account here.</SheetDescription>
        </SheetHeader>
        <DarkModeToggle />
        <LinkSimpleFin />
        <ResetPassword />
      </ScrollArea>
    </div>
  );
};

export default AccountSettings;

import { useIsMobile } from '@/components/hooks/use-mobile';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { MenuIcon } from 'lucide-react';
import SyncAccountButton from './sync-account-button';

const Header = (): JSX.Element => {
  const isMobile = useIsMobile();
  return (
    <div className="flex w-full flex-row items-center gap-2">
      {isMobile && (
        <SidebarTrigger>
          <MenuIcon />
        </SidebarTrigger>
      )}
      <h2 className="text-3xl font-semibold tracking-tight">Budget Board</h2>
      <div className="grow" />
      <SyncAccountButton />
    </div>
  );
};

export default Header;

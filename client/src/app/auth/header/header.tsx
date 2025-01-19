import { useIsMobile } from '@/components/hooks/use-mobile';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { MenuIcon } from 'lucide-react';
import SyncAccountButton from './sync-account-button';
import BudgetBoardLogo from '@/assets/budget-board-logo';
import { getIsDarkMode } from '@/lib/utils';

const Header = (): JSX.Element => {
  const isMobile = useIsMobile();

  return (
    <div className="flex w-full flex-row items-center gap-2">
      {isMobile && (
        <SidebarTrigger>
          <MenuIcon />
        </SidebarTrigger>
      )}
      <BudgetBoardLogo height={50} darkMode={getIsDarkMode()} />
      <div className="grow" />
      <SyncAccountButton />
    </div>
  );
};

export default Header;

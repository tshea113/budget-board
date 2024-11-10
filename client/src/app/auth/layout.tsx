import Tab from './tabs/tab';
import Header from './header';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar';

const DashboardLayout = (): JSX.Element => {
  return (
    <SidebarProvider>
      <div className="flex w-screen flex-row justify-center">
        <AppSidebar />
        <div className="flex w-full grow flex-col gap-2 p-3 2xl:max-w-screen-2xl">
          <Header />
          <Tab />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

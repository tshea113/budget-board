import Header from './header/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './header/app-sidebar';
import PageContent, { Pages } from './pages/page-content';
import React from 'react';

const DashboardLayout = (): JSX.Element => {
  const [currentPage, setCurrentPage] = React.useState(Pages.Dashboard);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex w-screen flex-row justify-center">
        <AppSidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex w-full grow flex-col gap-2 p-3 2xl:max-w-screen-2xl">
          <Header />
          <PageContent page={currentPage} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

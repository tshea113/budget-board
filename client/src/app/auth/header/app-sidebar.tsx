import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  BanknoteIcon,
  CalculatorIcon,
  ChartNoAxesColumnIncreasingIcon,
  ChevronsUpDown,
  GoalIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserPenIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AxiosError, AxiosResponse } from 'axios';
import { InfoResponse } from '@/types/user';
import { translateAxiosError } from '@/lib/requests';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import SheetItem from '@/components/sheet-item';
import { Pages } from '../pages/page-content';
import AccountSettings from '../account-settings/account-settings';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SyncAccountButton from './sync-account-button';

const menuItems = [
  {
    title: 'Dashboard',
    page: Pages.Dashboard,
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Transactions',
    page: Pages.Transactions,
    icon: BanknoteIcon,
  },
  {
    title: 'Budgets',
    page: Pages.Budgets,
    icon: CalculatorIcon,
  },
  {
    title: 'Goals',
    page: Pages.Goals,
    icon: GoalIcon,
  },
  {
    title: 'Trends',
    page: Pages.Trends,
    icon: ChartNoAxesColumnIncreasingIcon,
  },
];

interface AppSidebarProps {
  currentPage: Pages;
  setCurrentPage: (currentPage: Pages) => void;
}

const AppSidebar = (props: AppSidebarProps): JSX.Element => {
  const { request, setAccessToken } = React.useContext<any>(AuthContext);

  const { open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar();

  const queryClient = useQueryClient();
  const Logout = (): void => {
    request({
      url: '/api/logout',
      method: 'POST',
      data: {},
    })
      .then(() => {
        queryClient.removeQueries();
        setAccessToken('');
        localStorage.removeItem('refresh-token');
      })
      .catch((error: AxiosError) => {
        toast.error(translateAxiosError(error));
      });
  };

  const userInfoQuery = useQuery({
    queryKey: ['info'],
    queryFn: async (): Promise<InfoResponse | undefined> => {
      const res: AxiosResponse = await request({
        url: '/api/manage/info',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return undefined;
    },
  });

  return (
    <Sidebar collapsible="icon">
      {!isMobile && (
        <SidebarHeader>
          <SidebarMenu className="flex flex-row justify-end">
            <SidebarTrigger>
              {open ? (
                <ArrowLeftFromLineIcon className="h-5 w-5" />
              ) : (
                <ArrowRightFromLineIcon className="h-5 w-5" />
              )}
            </SidebarTrigger>
          </SidebarMenu>
        </SidebarHeader>
      )}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger>
                      <SidebarMenuButton
                        isActive={props.currentPage === item.page}
                        asChild
                        onClick={() => {
                          props.setCurrentPage(item.page);
                          isMobile ? setOpenMobile(false) : setOpen(false);
                        }}
                      >
                        <div>
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {!open && !openMobile && (
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <SidebarMenuButton
                size="lg"
                asChild
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex flex-row">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInfoQuery.data?.email.charAt(0).toLocaleUpperCase() ?? 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userInfoQuery.data?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" alignOffset={20} side="top">
              <SheetItem
                triggerChildren={
                  <div className="flex flex-row items-center gap-2">
                    <UserPenIcon className="h-4 w-4" />
                    <p>Account</p>
                  </div>
                }
                side="right"
              >
                <AccountSettings />
              </SheetItem>
              <DropdownMenuItem onClick={Logout}>
                <div className="flex flex-row items-center gap-2">
                  <LogOutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

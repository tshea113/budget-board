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
  CircleUserIcon,
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
import { AxiosError, AxiosResponse } from 'axios';
import { IUserInfoResponse } from '@/types/applicationUser';
import { translateAxiosError } from '@/lib/requests';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { type JSX } from 'react';
import { AuthContext } from '@/components/auth-provider';
import SheetItem from '@/components/sheet-item';
import { Pages } from '../pages/page-content';
import AccountSettings from '../account-settings/account-settings';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
    queryFn: async (): Promise<IUserInfoResponse | undefined> => {
      const res: AxiosResponse = await request({
        url: '/api/manage/info',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as IUserInfoResponse | undefined;
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
              <SidebarMenuButton asChild>
                <div className="flex h-12 flex-row items-center p-0">
                  {/* For some reason the size is being ignored here. I'm not sure why, but it's probably realted to Tailwindcss v4 updates.
                    Shadcn might fix this when they fully support v4, but for now the icon will be smaller than the old one. */}
                  <CircleUserIcon className="size-8" />
                  <span className="font-semibold">{userInfoQuery.data?.email}</span>
                  <ChevronsUpDown className="ml-auto size-4" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" alignOffset={20} side="top">
              <SheetItem
                triggerChildren={
                  <div className="flex flex-row items-center gap-2">
                    <UserPenIcon className="size-4" />
                    <p>Account</p>
                  </div>
                }
                side="right"
              >
                <AccountSettings />
              </SheetItem>
              <DropdownMenuItem onClick={Logout}>
                <div className="flex flex-row items-center gap-2">
                  <LogOutIcon className="size-4" />
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

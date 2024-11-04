import SheetItem from '@/components/sheet-item';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AccountSettings from './account-settings/account-settings';
import { AxiosResponse, type AxiosError } from 'axios';
import { translateAxiosError } from '@/lib/requests';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { InfoResponse } from '@/types/user';
import { toast } from 'sonner';

const Header = (): JSX.Element => {
  const { request, setAccessToken } = React.useContext<any>(AuthContext);

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
        toast('Uh oh! Something went wrong.', {
          description: translateAxiosError(error),
        });
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
    <div className="flex w-full flex-row">
      <h2 className="grow text-3xl font-semibold tracking-tight">Budget Board</h2>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>
              {userInfoQuery.data?.email.charAt(0).toLocaleUpperCase() ?? 'A'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {userInfoQuery.data?.email ?? 'not available'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <SheetItem triggerChildren={<p>Account</p>} side="right">
            <AccountSettings />
          </SheetItem>
          <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;

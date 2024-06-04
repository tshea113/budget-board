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
import { useQueryClient } from '@tanstack/react-query';
import AccountSettings from './account-settings/account-settings';
import { useToast } from '@/components/ui/use-toast';
import { type AxiosError } from 'axios';
import { translateAxiosError } from '@/lib/request';
import { logout } from '@/lib/auth';
import { useUserInfoQuery } from '@/lib/query';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';

const Header = (): JSX.Element => {
  const { accessToken, setAccessToken } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const Logout = (): void => {
    logout(accessToken)
      .then(() => {
        queryClient.removeQueries();
        setAccessToken('');
      })
      .catch((error: AxiosError) => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: translateAxiosError(error),
        });
      });
  };

  const userInfoQuery = useUserInfoQuery(accessToken);

  return (
    <div className="grid grid-cols-2">
      <h2 className="scroll-m-20 justify-self-start p-2 text-3xl font-semibold tracking-tight first:mt-0">
        Budget Board
      </h2>
      <div className="justify-self-end p-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>TS</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {userInfoQuery.data?.data.email ?? 'not available'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SheetItem triggerChildren={<p>Account</p>} side={'right'}>
              <AccountSettings />
            </SheetItem>
            <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;

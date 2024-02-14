import { AuthContext } from '@/components/auth-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { firebaseAuth } from '@/lib/firebase';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from 'firebase/auth';
import React from 'react';

const Header = (): JSX.Element => {
  const { currentUserState } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const Logout = (): void => {
    signOut(firebaseAuth)
      .then(() => {
        queryClient.removeQueries();
      })
      .catch((err) => {
        // TODO: Make this an alert dialog
        console.log(err);
      });
  };

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
          <DropdownMenuContent>
            <DropdownMenuLabel>{currentUserState.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;

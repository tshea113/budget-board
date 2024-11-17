import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { areStringsEqual, cn } from '@/lib/utils';
import { Account } from '@/types/account';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';
import { AuthContext } from './auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface AccountInputProps {
  selectedAccountIds: string[];
  setSelectedAccountIds: (accountIds: string[]) => void;
}

const AccountInput = (props: AccountInputProps): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { request } = React.useContext<any>(AuthContext);

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async (): Promise<Account[]> => {
      const res: AxiosResponse = await request({
        url: '/api/account',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  const toggleSelect = (account: Account) => {
    if (props.selectedAccountIds.some((a) => areStringsEqual(a, account.id))) {
      props.setSelectedAccountIds(
        props.selectedAccountIds.filter((a) => !areStringsEqual(a, account.id))
      );
    } else {
      props.setSelectedAccountIds([...props.selectedAccountIds, account.id]);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="dropdown"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {props.selectedAccountIds.length > 0
            ? props.selectedAccountIds.length + ' account(s) selected.'
            : 'Select accounts...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No accounts found.</CommandEmpty>
            <CommandGroup>
              {(accountsQuery.data ?? []).map((account: Account) => {
                const isSelected = props.selectedAccountIds.includes(account.id);

                return (
                  <CommandItem
                    className="font-bold"
                    key={account.id}
                    value={account.id}
                    onSelect={() => toggleSelect(account)}
                  >
                    <div className={cn(isSelected ? 'opacity-100' : 'opacity-0')}>
                      <Check className="mr-2 h-4 w-4" />
                    </div>
                    <span>{account.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AccountInput;

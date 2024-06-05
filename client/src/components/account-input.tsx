import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getAccountsById } from '@/lib/accounts';
import { cn } from '@/lib/utils';
import { Account } from '@/types/account';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';
import { AuthContext } from './auth-provider';
import { useQuery } from '@tanstack/react-query';

interface AccountInputProps {
  initialValues?: string[];
  onSelectChange: (accountIds: string[]) => void;
}

const AccountInput = (props: AccountInputProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async () =>
      await request({
        url: '/api/account',
        method: 'GET',
      }),
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<Account[]>(
    getAccountsById(props.initialValues ?? [], accountsQuery.data?.data ?? [])
  );
  const selectedValuesSet = React.useRef(new Set(selectedValues));

  const toggleSelect = (account: Account) => {
    if (selectedValuesSet.current.has(account)) {
      selectedValuesSet.current.delete(account);
      setSelectedValues(selectedValues.filter((v) => v !== account));
    } else {
      selectedValuesSet.current.add(account);
      setSelectedValues([...selectedValues, account]);
    }
    props.onSelectChange(Array.from(selectedValuesSet.current).map((v) => v.id));
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
          {selectedValues.length > 0
            ? selectedValues.length + ' account(s) selected.'
            : 'Select accounts...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No accounts found.</CommandEmpty>
            <CommandGroup>
              {(accountsQuery.data?.data ?? []).map((account: Account) => {
                const isSelected = selectedValuesSet.current.has(account);

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

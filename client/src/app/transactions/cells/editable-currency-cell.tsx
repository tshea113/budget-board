import { Input } from '@/components/ui/input';
import { type Transaction } from '@/types/transaction';
import React from 'react';

interface EditableCurrencyCellProps {
  currency: number;
  isSelected: boolean;
  isError: boolean;
  editCell: ((newTransaction: Transaction) => void) | undefined;
  rowTransaction: Transaction;
}

const EditableCurrencyCell = (props: EditableCurrencyCellProps): JSX.Element => {
  const [currencyValue, setCurrencyValue] = React.useState<string>(props.currency.toFixed(2));

  React.useEffect(() => {
    if (props.isError) {
      setCurrencyValue(props.currency.toFixed(2));
    }
  }, [props.isError]);

  const onCurrencyBlur = (): void => {
    if (!isNaN(parseFloat(currencyValue))) {
      const newTransaction: Transaction = {
        ...props.rowTransaction,
        amount: parseFloat(currencyValue),
      };
      if (props.editCell != null) {
        props.editCell(newTransaction);
      }
    } else {
      setCurrencyValue(props.currency.toFixed(2));
    }
  };

  const onCurrencyChange = (newCurrency: string): void => {
    setCurrencyValue(newCurrency);
  };

  if (props.isSelected) {
    return (
      <Input
        value={currencyValue}
        onChange={(e) => {
          onCurrencyChange(e.target.value);
        }}
        onBlur={onCurrencyBlur}
        type="text"
      />
    );
  } else {
    return (
      <span>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(parseFloat(currencyValue))}
      </span>
    );
  }
};

export default EditableCurrencyCell;

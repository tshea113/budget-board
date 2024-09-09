import { Input } from '@/components/ui/input';
import { convertNumberToCurrency } from '@/lib/utils';
import { type Transaction } from '@/types/transaction';
import React from 'react';

interface EditableCurrencyCellProps {
  transaction: Transaction;
  isSelected: boolean;
  isError: boolean;
  editCell: (newTransaction: Transaction) => void;
}

const EditableCurrencyCell = (props: EditableCurrencyCellProps): JSX.Element => {
  const [currencyDisplayValue, setCurrencyDisplayValue] = React.useState<string>(
    props.transaction.amount.toFixed(2)
  );

  React.useEffect(() => {
    if (props.isError) {
      setCurrencyDisplayValue(props.transaction.amount.toFixed(2));
    }
  }, [props.isError]);

  const onCurrencyBlur = (): void => {
    if (!isNaN(parseFloat(currencyDisplayValue))) {
      const newTransaction: Transaction = {
        ...props.transaction,
        amount: parseFloat(currencyDisplayValue),
      };
      if (props.editCell != null) {
        props.editCell(newTransaction);
      }
    } else {
      setCurrencyDisplayValue(props.transaction.amount.toFixed(2));
    }
  };

  const onCurrencyChange = (newCurrency: string): void => {
    setCurrencyDisplayValue(newCurrency);
  };

  return (
    <div>
      {props.isSelected ? (
        <Input
          className="text-center"
          value={currencyDisplayValue}
          onChange={(e) => {
            onCurrencyChange(e.target.value);
          }}
          onBlur={onCurrencyBlur}
          onClick={(e) => {
            e.stopPropagation();
          }}
          type="text"
        />
      ) : (
        <span>{convertNumberToCurrency(parseFloat(currencyDisplayValue), true)}</span>
      )}
    </div>
  );
};

export default EditableCurrencyCell;

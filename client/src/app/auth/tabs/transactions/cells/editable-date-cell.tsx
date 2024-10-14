import DatePicker from '@/components/date-picker';
import { formatDate } from '@/lib/transactions';
import { type Transaction } from '@/types/transaction';
import React from 'react';

interface EditableDateCellProps {
  transaction: Transaction;
  isSelected: boolean;
  editCell: ((newTransaction: Transaction) => void) | undefined;
}

const EditableDateCell = (props: EditableDateCellProps): JSX.Element => {
  const [dateDisplayValue, setDateDisplayValue] = React.useState(props.transaction.date);

  const onDatePick = (day: Date): void => {
    setDateDisplayValue(day);
    const newTransaction: Transaction = {
      ...props.transaction,
      date: day,
    };
    if (props.editCell != null) {
      props.editCell(newTransaction);
    }
  };

  return (
    <div>
      {props.isSelected ? (
        <DatePicker value={dateDisplayValue} onDayClick={onDatePick} />
      ) : (
        <div className="w-full">{formatDate(dateDisplayValue)}</div>
      )}
    </div>
  );
};

export default EditableDateCell;

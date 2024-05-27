import DatePicker from '@/components/date-picker';
import { formatDate } from '@/lib/transactions';
import { type Transaction } from '@/types/transaction';
import React from 'react';

interface EditableDateCellProps {
  date: Date;
  isSelected: boolean;
  isError: boolean;
  editCell: ((newTransaction: Transaction) => void) | undefined;
  rowTransaction: Transaction;
}

const EditableDateCell = (props: EditableDateCellProps): JSX.Element => {
  const [dateValue, setDateValue] = React.useState(props.date);

  React.useEffect(() => {
    if (props.isError) {
      setDateValue(props.date);
    }
  }, [props.isError]);

  const onDatePick = (day: Date): void => {
    setDateValue(day);
    const newTransaction: Transaction = {
      ...props.rowTransaction,
      date: day,
    };
    if (props.editCell != null) {
      props.editCell(newTransaction);
    }
  };

  return (
    <div className="w-[200px]">
      {props.isSelected ? (
        <DatePicker value={dateValue} onDayClick={onDatePick} />
      ) : (
        <div className="w-full">{formatDate(props.date)}</div>
      )}
    </div>
  );
};

export default EditableDateCell;

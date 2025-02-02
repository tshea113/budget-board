import DatePicker from '@/components/date-picker';
import { ITransaction } from '@/types/transaction';
import React from 'react';

interface EditableDateCellProps {
  transaction: ITransaction;
  isSelected: boolean;
  editCell: ((newTransaction: ITransaction) => void) | undefined;
  textClassName?: string;
}

const EditableDateCell = (props: EditableDateCellProps): JSX.Element => {
  const [dateDisplayValue, setDateDisplayValue] = React.useState(props.transaction.date);

  const onDatePick = (day: Date): void => {
    setDateDisplayValue(day);
    const newTransaction: ITransaction = {
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
        <span className={props.textClassName}>
          {new Date(dateDisplayValue).toLocaleDateString([], {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      )}
    </div>
  );
};

export default EditableDateCell;

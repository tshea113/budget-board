import { Input } from '@/components/ui/input';
import { cn, convertNumberToCurrency } from '@/lib/utils';
import React, { JSX } from 'react';

interface EditableCurrencyCellProps {
  className?: string;
  inputClassName?: string;
  textClassName?: string;
  value: number;
  isSelected: boolean;
  editCell: (newValue: number) => void;
  disableColor?: boolean;
  invertColor?: boolean;
  hideCents?: boolean;
}

const EditableCurrencyCell = (props: EditableCurrencyCellProps): JSX.Element => {
  const [currencyDisplayValue, setCurrencyDisplayValue] = React.useState<string>(
    props.value.toFixed(props.hideCents ? 0 : 2)
  );

  React.useEffect(() => {
    setCurrencyDisplayValue(props.value.toFixed(props.hideCents ? 0 : 2));
  }, [props.value]);

  const onCurrencyBlur = (): void => {
    if (!isNaN(parseFloat(currencyDisplayValue))) {
      props.editCell(parseFloat(currencyDisplayValue));
    } else {
      setCurrencyDisplayValue(props.value.toFixed(2));
    }
  };

  const onCurrencyChange = (newCurrency: string): void => {
    setCurrencyDisplayValue(newCurrency);
  };

  return (
    <div className={cn(props.className)}>
      {props.isSelected ? (
        <Input
          className={cn('text-center', props.inputClassName)}
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
        <span
          className={cn(
            'font-semibold',
            props.disableColor
              ? 'text-foreground'
              : props.value < 0
                ? 'text-destructive'
                : 'text-success',
            props.textClassName
          )}
        >
          {convertNumberToCurrency(parseFloat(currencyDisplayValue), !props.hideCents)}
        </span>
      )}
    </div>
  );
};

export default EditableCurrencyCell;

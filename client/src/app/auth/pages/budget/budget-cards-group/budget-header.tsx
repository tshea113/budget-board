interface BudgetHeaderProps {
  children: JSX.Element | string;
}

const BudgetHeader = (props: BudgetHeaderProps): JSX.Element => {
  return (
    <div className="mx-3 my-2 flex flex-row @container">
      <span className="w-2/5 text-lg font-semibold tracking-tight @sm:text-xl md:w-1/2">
        {props.children}
      </span>
      <div className="flex w-3/5 flex-row justify-items-center text-center md:w-1/2">
        <div className="w-1/3">Amount</div>
        <div className="w-1/3">Budget</div>
        <div className="w-1/3">Left</div>
      </div>
    </div>
  );
};

export default BudgetHeader;

interface BudgetHeaderProps {
  children: JSX.Element | string;
}

const BudgetHeader = (props: BudgetHeaderProps): JSX.Element => {
  return (
    <div className="my-2 space-y-1 px-3 py-1 shadow-md">
      <div className="grid grid-cols-2 @container">
        <div>
          <h3 className="scroll-m-20 justify-self-start text-lg font-semibold tracking-tight @sm:text-xl">
            {props.children}
          </h3>
        </div>
        <div className="grid grid-cols-3 justify-items-center">
          <div>Spent</div>
          <div>Budget</div>
          <div>Left</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetHeader;

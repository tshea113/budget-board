const CustomCategoryHeader = (): JSX.Element => {
  return (
    <div className="flex w-full flex-grow gap-2 p-2">
      <span className="w-1/2 grow font-semibold">Name</span>
      <span className="w-1/2 grow font-semibold">Parent</span>
      <span className="w-[26px]" />
    </div>
  );
};

export default CustomCategoryHeader;

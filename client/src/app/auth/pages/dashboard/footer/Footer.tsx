const Footer = (): JSX.Element => {
  return (
    <>
      {import.meta.env.VITE_VERSION && (
        <div className="flex h-8 flex-row items-end justify-start text-xs font-semibold text-foreground">
          <span>{import.meta.env.VITE_VERSION}</span>
        </div>
      )}
    </>
  );
};

export default Footer;

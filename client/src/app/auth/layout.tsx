import Tab from './tabs/tab';
import Header from './header';
const DashboardLayout = (): JSX.Element => {
  return (
    <div className="grid w-screen">
      <div className="flex w-full flex-col gap-2 place-self-center p-3 2xl:max-w-screen-2xl">
        <Header />
        <Tab />
      </div>
    </div>
  );
};

export default DashboardLayout;

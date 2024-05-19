import Tab from './tabs/tab';
import Header from './header';
const DashboardLayout = (): JSX.Element => {
  return (
    <div className="m-3 justify-center">
      <Header />
      <Tab />
    </div>
  );
};

export default DashboardLayout;

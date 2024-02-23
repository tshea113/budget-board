import { Card } from '@/components/ui/card';
import Tab from './tab';
import Header from './header';
const DashboardLayout = (): JSX.Element => {
  return (
    <Card className="m-1 justify-center">
      <Header />
      <Tab />
    </Card>
  );
};

export default DashboardLayout;

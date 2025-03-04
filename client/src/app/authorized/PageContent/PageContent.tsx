import Dashboard from "./Dashboard/Dashboard";
import Goals from "./Goals/Goals";
import Settings from "./Settings/Settings";
import Transactions from "./Transactions/Transactions";

export enum Pages {
  Dashboard,
  Transactions,
  Budgets,
  Goals,
  Trends,
  Settings,
}

interface PageContentProps {
  currentPage: Pages;
}

const PageContent = (props: PageContentProps): React.ReactNode => {
  switch (props.currentPage) {
    case Pages.Dashboard:
      return <Dashboard />;
    case Pages.Transactions:
      return <Transactions />;
    case Pages.Budgets:
      return <div>Budgets content</div>;
    case Pages.Goals:
      return <Goals />;
    case Pages.Trends:
      return <div>Trends content</div>;
    case Pages.Settings:
      return <Settings />;
  }
};

export default PageContent;

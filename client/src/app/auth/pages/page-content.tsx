import Dashboard from './dashboard/dashboard';
import Budgets from './budget/budgets';
import Transactions from './transactions/transactions';
import Goals from './goals/goals';

export enum Pages {
  Dashboard,
  Transactions,
  Budgets,
  Goals,
  Trends,
}

interface PageContentProps {
  page: Pages;
}

const PageContent = (props: PageContentProps): JSX.Element => {
  switch (props.page) {
    case Pages.Dashboard:
      return <Dashboard />;
    case Pages.Transactions:
      return <Transactions />;
    case Pages.Budgets:
      return <Budgets />;
    case Pages.Goals:
      return <Goals />;
    default:
      return <span>not found</span>;
  }
};

export default PageContent;

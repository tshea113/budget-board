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

const PageContent = (props: PageContentProps) => {
  switch (props.currentPage) {
    case Pages.Dashboard:
      return <div>Dashboard content</div>;
    case Pages.Transactions:
      return <div>Transactions content</div>;
    case Pages.Budgets:
      return <div>Budgets content</div>;
    case Pages.Goals:
      return <div>Goals content</div>;
    case Pages.Trends:
      return <div>Trends content</div>;
    case Pages.Settings:
      return <div>Settings content</div>;
  }
};

export default PageContent;

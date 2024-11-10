import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  BanknoteIcon,
  CalculatorIcon,
  ChartNoAxesColumnIncreasingIcon,
  GoalIcon,
  LayoutDashboardIcon,
} from 'lucide-react';
import { Pages } from './tabs/page-content';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    page: Pages.Dashboard,
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Transactions',
    page: Pages.Transactions,
    icon: BanknoteIcon,
  },
  {
    title: 'Budgets',
    page: Pages.Budgets,
    icon: CalculatorIcon,
  },
  {
    title: 'Goals',
    page: Pages.Goals,
    icon: GoalIcon,
  },
  {
    title: 'Trends',
    page: Pages.Trends,
    icon: ChartNoAxesColumnIncreasingIcon,
  },
];

interface AppSidebarProps {
  currentPage: Pages;
  setCurrentPage: (currentPage: Pages) => void;
}

const AppSidebar = (props: AppSidebarProps): JSX.Element => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => props.setCurrentPage(item.page)}
                  >
                    <div>
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;

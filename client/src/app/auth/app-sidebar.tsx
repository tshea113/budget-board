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

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '#',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Transactions',
    url: '#',
    icon: BanknoteIcon,
  },
  {
    title: 'Budgets',
    url: '#',
    icon: CalculatorIcon,
  },
  {
    title: 'Goals',
    url: '#',
    icon: GoalIcon,
  },
  {
    title: 'Trends',
    url: '#',
    icon: ChartNoAxesColumnIncreasingIcon,
  },
];

const AppSidebar = (): JSX.Element => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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

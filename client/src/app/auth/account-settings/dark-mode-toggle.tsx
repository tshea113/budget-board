import { useTheme } from '@/components/theme-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { JSX } from "react";

const DarkModeToggle = (): JSX.Element => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col gap-2 p-3">
      <span className="text-lg font-semibold tracking-tight">Theme</span>
      <Select onValueChange={setTheme} defaultValue={theme}>
        <SelectTrigger>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DarkModeToggle;

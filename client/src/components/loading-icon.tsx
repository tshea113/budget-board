import { cn } from '@/lib/utils';
import { RefreshCwIcon } from 'lucide-react';
import { JSX } from 'react';

interface LoadingIconProps {
  className?: string;
}

const LoadingIcon = (props: LoadingIconProps): JSX.Element => {
  return <RefreshCwIcon className={cn(props.className, 'animate-spin')} />;
};

export default LoadingIcon;

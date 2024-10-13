import { cn } from '@/lib/utils';
import { UpdateIcon } from '@radix-ui/react-icons';

interface LoadingIconProps {
  className?: string;
}

const LoadingIcon = (props: LoadingIconProps): JSX.Element => {
  return <UpdateIcon className={cn(props.className, 'animate-spin')} />;
};

export default LoadingIcon;

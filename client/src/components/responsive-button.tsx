import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface ResponsiveButtonProps {
  children: JSX.Element | string;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'dropdown'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
  loading: boolean;
  onClick?: (e: any) => void;
}

const ResponsiveButton = ({
  children,
  loading,
  onClick,
  ...props
}: ResponsiveButtonProps): JSX.Element => {
  if (loading) {
    return (
      <Button {...props} disabled>
        <Loader2 className="h-6 w-6 animate-spin" />
      </Button>
    );
  } else {
    return (
      <Button
        type="submit"
        onClick={(e) => {
          if (onClick != null) onClick(e);
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
};

export default ResponsiveButton;

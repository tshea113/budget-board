import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface ResponsiveButtonProps {
  children: JSX.Element | string;
  className?: string;
  variant?: string;
  loading: boolean;
  onClick?: (e: any) => void;
}

const ResponsiveButton = ({
  children,
  className,
  variant,
  loading,
  onClick,
}: ResponsiveButtonProps): JSX.Element => {
  if (loading) {
    return (
      <Button className={className} disabled>
        <Loader2 className="h-6 w-6 animate-spin" />
      </Button>
    );
  } else {
    return (
      <Button
        className={className}
        type="submit"
        onClick={(e) => {
          if (onClick != null) onClick(e);
        }}
      >
        {children}
      </Button>
    );
  }
};

export default ResponsiveButton;

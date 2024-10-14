import { Button } from './ui/button';
import LoadingIcon from './loading-icon';

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
        <LoadingIcon className="h-5 w-5" />
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

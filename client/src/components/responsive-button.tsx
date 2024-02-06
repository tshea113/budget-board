import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface ResponsiveButtonProps {
  children: JSX.Element | string;
  loading: boolean;
  onClick: () => void;
}

const ResponsiveButton = ({ children, loading, onClick }: ResponsiveButtonProps): JSX.Element => {
  if (loading) {
    return (
      <Button disabled>
        <Loader2 className="h-6 w-6 animate-spin" />
      </Button>
    );
  } else {
    return (
      <Button className="w-fit" type="submit" onClick={onClick}>
        {children}
      </Button>
    );
  }
};

export default ResponsiveButton;

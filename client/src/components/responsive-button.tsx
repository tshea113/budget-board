import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

const ResponsiveButton = ({
  children,
  loading,
  onClick,
}: {
  children: JSX.Element | string;
  loading: boolean;
  onClick: () => void;
}): JSX.Element => {
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

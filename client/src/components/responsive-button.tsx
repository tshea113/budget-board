import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

const ResponsiveButton = ({
  children,
  loading,
}: {
  children: JSX.Element | string;
  loading: boolean;
}): JSX.Element => {
  if (loading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  } else {
    return <Button type="submit">{children}</Button>;
  }
};

export default ResponsiveButton;

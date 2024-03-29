import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface SuccessBannerProps {
  message: string;
}

const SuccessBanner = ({ message }: SuccessBannerProps): JSX.Element => {
  return (
    <>
      {message.length !== 0 && (
        <Alert variant="success">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SuccessBanner;

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AlertBannerProps {
  alert: string;
}

const AlertBanner = ({ alert }: AlertBannerProps): JSX.Element => {
  return (
    <>
      {alert.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertBanner;

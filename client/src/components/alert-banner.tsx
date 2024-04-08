import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Button } from './ui/button';

interface AlertBannerProps {
  alert: string;
  setAlert: (newAlert: string) => void;
}

const AlertBanner = (props: AlertBannerProps): JSX.Element => {
  return (
    <>
      {props.alert.length > 0 && (
        <Alert variant="destructive">
          <div className="flex flex-row">
            <div>
              <div className="flex flex-row space-x-1">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
              </div>

              <AlertDescription>{props.alert}</AlertDescription>
            </div>
            <div className="flex-grow" />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                props.setAlert('');
              }}
            >
              <Cross1Icon />
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
};

export default AlertBanner;

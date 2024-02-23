/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { AuthContext } from '@/components/auth-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useContext } from 'react';

const EmailVerified = (): JSX.Element | null => {
  const { emailVerified } = useContext<any>(AuthContext);

  if (!emailVerified) {
    return (
      <Alert variant="destructive" className="mb-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Before you can get started, you will need to check your email for a validation link.
        </AlertDescription>
      </Alert>
    );
  } else return null;
};

export default EmailVerified;

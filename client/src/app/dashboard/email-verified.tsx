/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { AuthContext } from '@/components/auth-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useContext } from 'react';

const EmailVerified = (): JSX.Element | null => {
  const { emailVerified, sendVerificationEmail } = useContext<any>(AuthContext);

  const resendVerification = (): void => {
    sendVerificationEmail();
  };

  if (!emailVerified) {
    return (
      <Alert variant="destructive" className="mb-2 p-1">
        <AlertDescription className="flex items-center">
          <AlertCircle className="mr-1 h-4 w-4" />
          Before you can get started, you will need to check your email for a validation link.
          <Button onClick={resendVerification} className="mx-2 my-0" variant="link">
            Resend Verification
          </Button>
        </AlertDescription>
      </Alert>
    );
  } else return null;
};

export default EmailVerified;

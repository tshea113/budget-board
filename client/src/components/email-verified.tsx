/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { firebaseAuth, sendVerificationEmail } from '@/lib/firebase';
import { AlertCircle } from 'lucide-react';

const EmailVerified = (): JSX.Element | null => {
  const resendVerification = (): void => {
    void sendVerificationEmail();
  };

  if (!firebaseAuth.currentUser?.emailVerified) {
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

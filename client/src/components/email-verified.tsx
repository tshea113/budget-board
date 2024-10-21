/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import { AuthContext } from './auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { InfoResponse } from '@/types/user';

const EmailVerified = (): JSX.Element | null => {
  const resendVerification = (): void => {
    // TODO: Send verification email
  };

  const { request } = React.useContext<any>(AuthContext);

  const userInfoQuery = useQuery({
    queryKey: ['info'],
    queryFn: async (): Promise<InfoResponse | undefined> => {
      const res: AxiosResponse = await request({
        url: '/api/manage/info',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return undefined;
    },
  });

  if (!(userInfoQuery.data?.isEmailConfirmed ?? true) && !userInfoQuery.isPending) {
    return (
      <Alert variant="destructive" className="p-1">
        <AlertDescription className="flex items-center">
          <AlertCircle className="mr-1 h-4 w-4" />
          Before you can get started, you will need to check your email for a validation
          link.
          <Button onClick={resendVerification} className="mx-2 my-0" variant="link">
            Resend Verification
          </Button>
        </AlertDescription>
      </Alert>
    );
  } else return null;
};

export default EmailVerified;

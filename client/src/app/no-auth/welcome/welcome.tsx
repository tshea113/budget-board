import Modal from '@/components/modal';
import Login from './login';
import Signup from './sign-up';
import React from 'react';
import ResetPassword from './reset-password';
import { Card } from '@/components/ui/card';

export enum LoginCardState {
  Login,
  ResetPassword,
}

const Welcome = (): JSX.Element => {
  const [loginCardState, setLoginCardState] = React.useState<LoginCardState>(
    LoginCardState.ResetPassword
  );
  const [email, setEmail] = React.useState<string>('');

  const getCardState = (): JSX.Element => {
    switch (loginCardState) {
      case LoginCardState.Login:
        return <Login setLoginCardState={setLoginCardState} setEmail={setEmail} />;
      case LoginCardState.ResetPassword:
        return <ResetPassword setLoginCardState={setLoginCardState} email={email} />;
      default:
        return <>There was an error.</>;
    }
  };

  return (
    <div className="flex h-screen flex-col place-content-center items-center gap-8 p-2">
      <div className="text-center">
        <h3 className="text-2xl tracking-tight">Welcome to</h3>
        <h1 className="text-4xl font-bold sm:text-6xl">Budget Board</h1>
        <p className="mt-6 text-lg leading-8">
          A simple app for managing monthly budgets.
        </p>
      </div>
      <Card className="w-full max-w-md p-2">{getCardState()}</Card>
      <div className="mt-10 hidden items-center justify-center gap-x-6">
        <Modal button="Sign Up">
          <Signup />
        </Modal>
      </div>
    </div>
  );
};

export default Welcome;

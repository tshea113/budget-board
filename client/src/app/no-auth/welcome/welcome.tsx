import Login from './login';
import Register from './register';
import React from 'react';
import ResetPassword from './reset-password';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BudgetBoardLogo from '@/assets/budget-board-logo';
import { getIsDarkMode } from '@/lib/utils';

export enum LoginCardState {
  Login,
  ResetPassword,
  Register,
}

const Welcome = (): JSX.Element => {
  const [loginCardState, setLoginCardState] = React.useState<LoginCardState>(
    LoginCardState.Login
  );
  const [email, setEmail] = React.useState<string>('');

  const getCardState = (): JSX.Element => {
    switch (loginCardState) {
      case LoginCardState.Login:
        return <Login setLoginCardState={setLoginCardState} setEmail={setEmail} />;
      case LoginCardState.ResetPassword:
        return <ResetPassword setLoginCardState={setLoginCardState} email={email} />;
      case LoginCardState.Register:
        return <Register setLoginCardState={setLoginCardState} />;
      default:
        return <>There was an error.</>;
    }
  };

  return (
    <div className="flex h-screen flex-col place-content-center items-center gap-8 p-2">
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-2xl tracking-tight">Welcome to</h3>
        <BudgetBoardLogo width={340} darkMode={getIsDarkMode()} />
        <p className="text-lg">A simple app for managing monthly budgets.</p>
      </div>
      <Card className="w-full max-w-md p-2">{getCardState()}</Card>
      {loginCardState !== LoginCardState.Register && (
        <div className="flex flex-row items-center gap-1">
          <span>Don't have an account?</span>
          <Button
            className="p-1"
            variant="link"
            onClick={() => setLoginCardState(LoginCardState.Register)}
          >
            Register here
          </Button>
        </div>
      )}
    </div>
  );
};

export default Welcome;

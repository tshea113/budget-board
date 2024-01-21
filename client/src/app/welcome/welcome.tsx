import Modal from '@/components/modal';
import Login from './login';
import Signup from './sign-up';

const Welcome = (): JSX.Element => {
  return (
    <div className="mx-auto max-w-2xl py-32 text-center sm:py-48 lg:py-56">
      <h3 className="text-2xl tracking-tight">Welcome to</h3>
      <h1 className="text-4xl font-bold sm:text-6xl">Money Minder</h1>
      <p className="mt-6 text-lg leading-8">A simple app for managing monthly budgets.</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Modal button="Login">
          <Login />
        </Modal>
        <Modal button="Sign Up">
          <Signup />
        </Modal>
      </div>
    </div>
  );
};

export default Welcome;

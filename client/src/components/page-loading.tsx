import { TailSpin } from 'react-loader-spinner';

const PageLoading = (): JSX.Element => {
  // TODO: This probably should be themed
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="m-auto">
        <TailSpin height="100" width="100" color="gray" />
      </div>
    </div>
  );
};

export default PageLoading;

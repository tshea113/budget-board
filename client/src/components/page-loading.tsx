import LoadingIcon from './loading-icon';

const PageLoading = (): JSX.Element => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingIcon className="m-auto h-[100px] w-[100px]" />
    </div>
  );
};

export default PageLoading;

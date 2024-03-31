import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '../../components/ui/card';

const SkeletonTranasctionTable = (): JSX.Element => {
  return (
    <Card className="w-screen">
      <div className="m-3 flex flex-col space-y-3">
        <Skeleton className="h-10 max-w-[125px]" />
        <Skeleton className="max-w-screen h-[550px] rounded-xl" />
      </div>
    </Card>
  );
};

export default SkeletonTranasctionTable;

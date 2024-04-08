import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '../../components/ui/card';

const SkeletonAccountCard = (): JSX.Element => {
  return (
    <Card>
      <div className="m-3 flex flex-col space-y-3">
        <Skeleton className="h-10 max-w-[125px]" />
        <Skeleton className="h-[250px] max-w-[500px] rounded-xl" />
      </div>
    </Card>
  );
};

export default SkeletonAccountCard;

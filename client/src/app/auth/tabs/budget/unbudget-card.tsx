import { AuthContext } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { getCategories, getCategoryLabel } from '@/lib/category';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface UnbudgetCardProps {
  name: string;
  amount: string;
}

const UnbudgetCard = (props: UnbudgetCardProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      await request({
        url: '/api/category',
        method: 'GET',
      }),
  });

  const allCategories = getCategories(categoriesQuery.data?.data ?? []);

  return (
    <Card className="flex w-full flex-row px-3 py-1">
      <div className="w-1/2 scroll-m-20 justify-self-start text-lg font-semibold tracking-tight">
        {props.name === 'null'
          ? 'Uncategorized'
          : getCategoryLabel(allCategories, props.name) ?? props.name}
      </div>
      <div className="w-1/2">
        <div className="w-1/3 scroll-m-20 justify-self-start text-center text-lg font-semibold tracking-tight">
          ${props.amount}
        </div>
      </div>
    </Card>
  );
};

export default UnbudgetCard;

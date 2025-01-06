import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import AddCategory from './add-category';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import CustomCategoryCard from './custom-category-card';
import { ICategoryResponse } from '@/types/category';
import CustomCategoryHeader from './custom-category-header';

const AddCategoryAccordion = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await request({
        url: '/api/transactionCategory',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data;
      }

      return undefined;
    },
  });

  return (
    <div className="rounded-md px-3">
      <Accordion type="single" collapsible className="w-full" defaultValue="add-category">
        <AccordionItem value="add-category">
          <AccordionTrigger>
            <span>Custom Categories</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex w-full flex-col items-center gap-4">
              <AddCategory />
              <div className="flex w-full flex-col gap-2">
                <CustomCategoryHeader />
                {categoriesQuery.isPending ? (
                  <Skeleton />
                ) : (
                  categoriesQuery.data?.map((category: ICategoryResponse) => (
                    <CustomCategoryCard key={category.id} category={category} />
                  ))
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddCategoryAccordion;

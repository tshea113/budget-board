import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import AddCategory from './add-category';

const AddCategoryAccordion = (): JSX.Element => {
  return (
    <div className="rounded-md px-3">
      <Accordion type="single" collapsible className="w-full" defaultValue="add-category">
        <AccordionItem value="add-category">
          <AccordionTrigger>
            <span>Add Category</span>
          </AccordionTrigger>
          <AccordionContent>
            <AddCategory />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddCategoryAccordion;

import { Accordion, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const AddCategoryAccordion = (): JSX.Element => {
  return (
    <div className="m-2 rounded-md px-3">
      <Accordion type="single" collapsible className="w-full" defaultValue="add-category">
        <AccordionItem value="add-category">
          <AccordionTrigger>
            <span>Add Category</span>
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddCategoryAccordion;

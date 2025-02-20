/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { PlusIcon } from 'lucide-react';

interface AddButtonProps {
  children: JSX.Element;
}

const AddButtonSheet = ({ children }: AddButtonProps): JSX.Element => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetTitle className="hidden" />
      <SheetContent
        side="top"
        aria-describedby={undefined}
        className="flex h-full w-full flex-row justify-center"
      >
        <div className="w-full 2xl:max-w-(--breakpoint-2xl)">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default AddButtonSheet;

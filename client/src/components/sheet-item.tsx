import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenuItem } from './ui/dropdown-menu';

interface SheetItemProps {
  onSelect?: () => void;
  onOpenChange?: (arg0: boolean) => void;
  side?: 'top' | 'bottom' | 'left' | 'right' | null | undefined;
  children: JSX.Element;
  triggerChildren: JSX.Element;
}

const SheetItem = (props: SheetItemProps): JSX.Element => {
  return (
    <Sheet onOpenChange={props.onOpenChange}>
      <SheetTrigger asChild>
        <DropdownMenuItem
          onSelect={(event: { preventDefault: () => void }) => {
            event.preventDefault();
            props.onSelect?.();
          }}
        >
          {props.triggerChildren}
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="w-[800px]" side={props.side ?? undefined}>
        {props.children}
      </SheetContent>
    </Sheet>
  );
};

export default SheetItem;

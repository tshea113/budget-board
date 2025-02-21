import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { JSX, useState } from 'react';
import ModalProvider from './modal-provider';

const Modal = ({ button, children }: { button: string; children: any }): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <ModalProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>{button}</Button>
        </DialogTrigger>
        <DialogTitle className="hidden" />
        <DialogContent aria-describedby="">{children}</DialogContent>
      </Dialog>
    </ModalProvider>
  );
};

export default Modal;

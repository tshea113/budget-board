import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import ModalProvider from './modal-provider';

const Modal = ({ button, children }: { button: string; children: any }): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <ModalProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>{button}</Button>
        </DialogTrigger>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </ModalProvider>
  );
};

export default Modal;

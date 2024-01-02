import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

function Modal({button, children}: {button: string, children: any}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {button}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Modal({button, children}: {button: string, children: any}) {
  return (
    <Dialog>
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
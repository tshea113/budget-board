import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Signup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent>
        Bongus
      </DialogContent>
    </Dialog>
  )
}

export default Signup
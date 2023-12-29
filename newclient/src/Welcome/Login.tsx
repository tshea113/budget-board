import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Login() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Login
        </Button>
      </DialogTrigger>
      <DialogContent>
        Bingus
      </DialogContent>
    </Dialog>
  )
}

export default Login
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

function ResponsiveButton({waiting}: {waiting: boolean}) {
  if (waiting){
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
      </Button>
    )
  } else {
    return (
      <Button type="submit">Submit</Button>
    )
  }
}

export default ResponsiveButton
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { AuthContext } from "@/Misc/AuthProvider";
import { useContext } from "react";

const ResponsiveButton = () => {
  const { loading } = useContext<any>(AuthContext)

  if (loading){
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
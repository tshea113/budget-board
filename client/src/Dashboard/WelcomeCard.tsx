import { AuthContext } from "@/Misc/AuthProvider";
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useContext } from "react";

const WelcomeCard = () => {
  const { user } = useContext<any>(AuthContext)

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          Hello, {user?.email}.
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

export default WelcomeCard;
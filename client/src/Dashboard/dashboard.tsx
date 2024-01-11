import { Button } from "@/components/ui/button"
import { firebaseAuth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import AddItems from "./add-items"
import WelcomeCard from "./welcome-card"

function Dashboard() {
  const navigate = useNavigate()

  function Logout() {
    signOut(firebaseAuth).then(() => {
      navigate('/')
    }).catch((err) => {
      console.log(err)
    })
  }
  return(
    <div>
      <div className="flex flex-row space-x-2">
        <WelcomeCard />
        <AddItems />
      </div>
      <Button onClick={Logout}>
        Logout
      </Button>
    </div>
  )
}

export default Dashboard
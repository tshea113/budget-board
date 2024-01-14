import { Button } from "@/components/ui/button"
import { firebaseAuth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import AddItems from "./add-items"
import WelcomeCard from "./welcome-card"
import { useQueryClient } from "@tanstack/react-query"

function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  function Logout() {
    signOut(firebaseAuth).then(() => {
      queryClient.removeQueries()
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
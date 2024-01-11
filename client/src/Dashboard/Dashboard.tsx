import { AuthContext } from "@/Misc/AuthProvider"
import { Button } from "@/components/ui/button"
import { firebaseAuth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import AddItems from "./AddItems"
import WelcomeCard from "./WelcomeCard"

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
    <div className="flex">
      <div className="flex-row">
        <WelcomeCard />
        <AddItems />
      </div>
      <div className="flex-row">
        <Button onClick={Logout}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Dashboard
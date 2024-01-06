import { AuthContext } from "@/Misc/AuthProvider"
import { Button } from "@/components/ui/button"
import { firebaseAuth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useContext<any>(AuthContext)

  function Logout() {
    signOut(firebaseAuth).then(() => {
      navigate('/')
    }).catch((err) => {
      console.log(err)
    })
  }
  return(
    <>
      <p>Hello, {user?.email}</p>
      <Button onClick={Logout}>
        Logout
      </Button>
    </>
  )
}

export default Dashboard
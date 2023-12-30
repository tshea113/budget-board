import { Button } from "@/components/ui/button"
import { firebaseAuth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()

  function Logout() {
    signOut(firebaseAuth).then(() => {
      navigate('/')
      console.log('Logged out!')
    }).catch((err) => {
      console.log(err)
    })
  }
  return(
    <>
      <p>This is a dashboard</p>
      <Button onClick={Logout}>
        Logout
      </Button>
    </>
  )
}

export default Dashboard
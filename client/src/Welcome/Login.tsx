import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { useContext } from "react";
import ResponsiveButton from "@/components/responsive-button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/Misc/AuthProvider";
import axios from 'axios'
import { UserCredential } from "firebase/auth"
import { firebaseAuth } from "@/lib/firebase"

const GetUser = ({token}: {token: string}) => {
  const headers = {authorization: 'Bearer ' + token}
  axios({
    url: import.meta.env.VITE_API_URL + '/api/user',
    method: 'GET',
    headers: headers
  }).then((res) => {
    console.log(res)
  }).catch((err: Error) => {
    console.error(err.message)
  })
}

const Login = () => {
  const navigate = useNavigate()
  const { loginUser } = useContext<any>(AuthContext)

  type FormValues = {
    email: string
    password: string
  }

  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: "This field must be filled." })
      .email("This is not a valid email"),
    password: z
      .string()
      .min(7, { message: "Password must be at least 7 characters"})
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const submitUserLogin: SubmitHandler<FormValues> = async (values: z.infer<typeof formSchema>, e: any) => {
    try {
      const userCredential: UserCredential = await loginUser(values.email, values.password)
      if (userCredential) {
        console.log(userCredential.user)
          const token = await firebaseAuth.currentUser?.getIdToken()
          if (token) {
            GetUser({token})
            navigate('/dashboard')
          } else {
            console.error('Token not found!')
          }
      } else {
        console.error('User not found!')
      }
    } catch (err) {
      console.error(err)
    }
    e.preventDefault()
  }

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold">
        Login
      </h1>
      <form
        onSubmit={form.handleSubmit(submitUserLogin)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ResponsiveButton />
      </form>
    </Form>
  )
}

export default Login
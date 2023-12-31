import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import ResponsiveButton from "@/components/custom/ResponsiveButton";
import { useNavigate } from "react-router-dom";
import { UserCredential } from "firebase/auth";
import { AuthContext } from "@/Misc/AuthProvider";

function Login() {
  const navigate = useNavigate()
  const { loginUser } = useContext<any>(AuthContext)

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    loginUser(values.email, values.password)
      .then((result: UserCredential) => {
        console.log(result)
        navigate('/dashboard')
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold">
        Login
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
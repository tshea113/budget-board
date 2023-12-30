import ResponsiveButton from "@/components/custom/ResponsiveButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { firebaseAuth } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod"

function Signup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <SignupForm />
      </DialogContent>
    </Dialog>
  )
}

function SignupForm() {
  const navigate = useNavigate()
  const [signingUp, setSigningUp] = useState(false)

  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: "This field must be filled." })
      .email("This is not a valid email"),
    password: z
      .string()
      .min(7, { message: "Password must be at least 7 characters"}),
    confirm: z
      .string()
      .min(7, { message: "Password must be at least 7 characters"})
  }).superRefine(({ confirm, password }, ctx) => {
    if (confirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path:["confirm"]
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSigningUp(true)
    try {
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
      console.log(user)
    } catch (err) {
      console.log(err)
    } finally {
      setSigningUp(false)
    }
  }

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold">
        Sign Up
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
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ResponsiveButton waiting={signingUp}/>
      </form>
    </Form>
  )
}

export default Signup
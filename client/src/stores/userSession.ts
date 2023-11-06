import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

export const useSessionStore = defineStore('userSession', () => {
  const session = ref(null)

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    return await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
  }

  const handleSignUp = async ({ email, password }: { email: string; password: string }) => {
    try {
      // prompt user if they have not filled populated their credentials
      if (!email || !password) {
        alert('Please provide both your email and password.')
        return
      }
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        alert(error.message)
        console.error(error, error.message)
        return error
      }
      alert('Signup successful, confirmation mail should be sent soon!')
    } catch (err) {
      alert('Fatal error signing up')
      console.error('signup error', err)
      return err
    }
  }

  return { session, handleLogin, handleSignUp }
})

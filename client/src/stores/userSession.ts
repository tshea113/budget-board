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
    return await supabase.auth.signUp({
      email: email,
      password: password
    })
  }

  const handleLogOut = async () => {
    return await supabase.auth.signOut()
  }

  return { session, handleLogin, handleSignUp, handleLogOut }
})

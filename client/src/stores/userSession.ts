import { defineStore } from 'pinia'
import { firebaseApp } from '@/utils/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  setPersistence,
  type User,
  browserLocalPersistence
} from 'firebase/auth'

export const useSessionStore = defineStore('userSession', {
  state: () => {
    return {
      userData: null as unknown,
      loadingUser: false,
      loadingSession: false
    }
  },
  actions: {
    async handleLogin(email: string, password: string) {
      this.loadingUser = true
      try {
        const firebaseAuth = getAuth(firebaseApp)
        setPersistence(firebaseAuth, browserLocalPersistence).then(async () => {
          const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password)
          this.userData = { email: user.email, uid: user.uid }
        })
      } catch (error: any) {
        // Handle Errors here.
        let errorMessage = ''
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email'
            break
          case 'auth/user-disabled':
            errorMessage = 'This email has been disabled'
            break
          case 'auth/user-not-found':
            errorMessage = 'No account with that email was found'
            break
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password'
            break
          default:
            errorMessage = error.message
            break
        }
        alert(errorMessage)
        console.log(errorMessage)
      } finally {
        this.loadingUser = false
      }
    },
    async handleSignUp(email: string, password: string) {
      this.loadingUser = true
      try {
        const firebaseAuth = getAuth(firebaseApp)
        const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password)
        this.userData = { email: user.email, uid: user.uid }
      } catch (error: any) {
        console.log(error)
      } finally {
        this.loadingUser = false
      }
    },
    async handleLogOut() {
      try {
        const firebaseAuth = getAuth(firebaseApp)
        await signOut(firebaseAuth)
        this.userData = null
      } catch (error: any) {
        console.log(error)
      }
    },
    setUser(user: User) {
      this.userData = { email: user.email, uid: user.uid }
    }
  },
  persist: true
})

onAuthStateChanged(getAuth(firebaseApp), async (user) => {
  const store = useSessionStore()
  store.setUser(user as User)
})

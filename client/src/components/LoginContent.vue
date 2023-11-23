<template>
  <div class="flex min-h-full flex-col justify-center px-12 pb-12">
    <div class="pb-4 pt-2 sm:mx-auto sm:w-full sm:max-w-lg">
      <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Log in to your account
      </h2>
    </div>
    <h2 v-if="errorMessage">{{ errorMessage }}</h2>
    <div class="mt-5">
      <div class="group space-y-5">
        <div class="mb-2">
          <label class="text-sm">
            <span>Email</span>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              novalidate
              class="peer block w-full rounded-md border-0 px-1.5 py-1.5 leading-6 shadow-sm ring-1 ring-inset ring-gray-300 focus:accent-indigo-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
              placeholder=" "
              v-model="email"
            />
            <!-- I got tired of trying to get this to work, so I got rid of it-->
            <span
              class="mt-2 hidden text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
            >
              Please enter a valid email address
            </span>
          </label>
        </div>
        <label class="text-sm">
          <span>Password</span>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            novalidate
            class="peer block w-full rounded-md border-0 px-1.5 py-1.5 leading-6 ring-1 ring-inset ring-gray-300 focus:accent-indigo-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
            placeholder=" "
            pattern=".{7,}"
            v-model="password"
            v-on:keyup.enter="login"
          />
          <span
            class="mt-2 hidden text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
          >
            Password must be at least 7 characters
          </span>
        </label>
        <div class="flex items-center justify-between">
          <label class="select-none text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            <input
              id="remember-checkbox"
              type="checkbox"
              class="mr-1 h-4 w-4 accent-indigo-600 hover:text-indigo-500"
            />
            <span>Remember Me</span>
          </label>
          <a class="select-none text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >Forgot password?</a
          >
        </div>
        <button
          type="submit"
          class="flex w-full justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30"
          @click="login"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/userSession'

let email = ref('')
let password = ref('')
let errorMessage = ref('')

const sessionStore = useSessionStore()
const router = useRouter()

async function login() {
  try {
    // The store handles the login through supabase
    await sessionStore.handleLogin(email.value, password.value)
    if (sessionStore.userData.email !== null && sessionStore.userData.uid !== null) {
      // Redirect if login was successful
      router.push({ path: '/dashboard' })
    } else {
      console.error('No user session detected')
    }
  } catch (e: any) {
    console.error('There was an issue logging in: ', e)
  }
}
</script>

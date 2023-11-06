<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-lg">
      <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Log in to your account
      </h2>
    </div>

    <div class="mt-5 sm:mx-auto md:w-full sm:max-w-lg">
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
          >Email address</label
        >
        <div class="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            v-model="email"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
          >Password</label
        >
        <div class="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            v-model="password"
          />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-sm">
          <input
            id="remember-checkbox"
            type="checkbox"
            value=""
            class="w-4 h-4 rounded-sm text-indigo-600 hover:text-indigo-500"
          />
          <label
            for="remember-checkbox"
            class="ml-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >Remember Me</label
          >
        </div>
        <div class="text-sm">
          <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
            >Forgot password?</a
          >
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

const sessionStore = useSessionStore()
const router = useRouter()

async function login() {
  try {
    // The store handles the login through supabase
    const { data, error } = await sessionStore.handleLogin({
      email: email.value,
      password: password.value
    })
    if (error) throw error
    if (!data) {
      alert('Check your login details!')
    }
    console.log(data.user.email)

    // Redirect if login was successful
    router.replace({ path: '/' })
  } catch (error) {
    console.error('There was an issue logging in: ', error)
    alert(error)
  }
}
</script>

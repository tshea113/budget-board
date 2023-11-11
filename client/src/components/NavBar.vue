<template>
  <nav class="mx-auto flex w-full items-center bg-indigo-400 px-6 py-4">
    <div class="flex-0">
      <h1 class="text-4xl font-black text-gray-900">Money Minder</h1>
    </div>
    <div class="grow"></div>
    <div class="flex-0 justify-end">
      <button
        class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="logOut"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/userSession'
import { useRouter } from 'vue-router'

const sessionStore = useSessionStore()
const router = useRouter()

async function logOut() {
  try {
    await sessionStore.handleLogOut()
    router.replace({ path: '/' })
  } catch (err) {
    console.error('There was an errror logging out: ', err)
  }
}
</script>

<style scoped></style>

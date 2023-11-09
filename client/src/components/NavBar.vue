<template>
  <div>
    <button
      class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      @click="logOut"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/userSession'
import { useRouter } from 'vue-router'

const sessionStore = useSessionStore()
const router = useRouter()

async function logOut() {
  try {
    await sessionStore.handleLogOut()
    router.replace({ path: '/welcome' })
  } catch (err) {
    console.error('There was an errror logging out: ', err)
  }
}
</script>

<style scoped></style>

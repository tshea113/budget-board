<template>
  <div class="flex flex-col min-h-screen">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSessionStore } from './stores/userSession'
import { supabase } from './utils/supabase'

// init the userSession store
const sessionStore = useSessionStore()

// listen for auth events (e.g. sign in, sign out, refresh)
// set session based on the auth event
supabase.auth.onAuthStateChange((event: any, session: any) => {
  console.log(event)
  sessionStore.session = session
})
</script>

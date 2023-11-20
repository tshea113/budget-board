<template>
  <div class="flex min-h-screen flex-col">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSessionStore } from './stores/userSession'

// init the userSession store
useSessionStore()
</script>

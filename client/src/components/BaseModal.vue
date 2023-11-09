<template>
  <div
    v-show="modalActive"
    class="absolute left-0 top-0 flex h-screen w-full justify-center bg-black bg-opacity-30"
  >
    <div
      v-if="modalActive"
      ref="target"
      class="mt-32 max-w-2xl flex-col self-start rounded-lg bg-white p-4"
    >
      <button class="" @click="$emit('close-modal')">
        <XMarkIcon class="h-6 w-6 justify-end hover:text-indigo-600"></XMarkIcon>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

defineProps({
  modalActive: {
    default: false
  }
})
const emit = defineEmits(['close-modal'])

const target = ref(null)
onClickOutside(target, () => emit('close-modal'))
</script>

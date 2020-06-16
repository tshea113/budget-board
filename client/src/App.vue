<template>
    <v-app>
      <app-navigation></app-navigation>
      <v-content transition="slide-x-transition">
        <router-view></router-view>
      </v-content>
      <app-tabs></app-tabs>
    </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AppNavigation from '@/components/AppNavigation.vue';
import AppTabs from '@/components/AppTabs.vue';

export default {
  name: 'App',
  components: {
    AppNavigation,
    AppTabs,
  },
  computed: {
    ...mapState([
      'account',
    ]),
  }
};
</script>

<style>
</style>

<template>
  <v-bottom-navigation
    :value="activeBtn"
    color="" 
    dark
    grow
  >
    <v-btn to='/dashboard'>
      <span>Dashboard</span>
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>
    <!-- <v-btn to='/workout'>
      <span>Test</span>
      <v-icon>mdi-weight-lifter</v-icon>
    </v-btn> -->
  </v-bottom-navigation>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AppTabs',
  data() {
    return {
      items: ['Dashboard', 'Workout'],
      activeBtn: 1,
    };
  },
  computed: {
    ...mapState([
    ]),
  },
  components: {
  },
  methods: {
    ...mapActions([
    ]),
  },
};
</script>
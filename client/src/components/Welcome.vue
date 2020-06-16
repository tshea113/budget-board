<template>
  <v-container id="welcome" fluid fill-height style="max-height: 100vh;">
    <v-layout justify-center align-center column pa-5>
      <div
        id="content"
        class="display-2
          font-weight-black
          white--text
          text-xs-center
          mb-3"
      >
        REP NOTES
      </div>
      <div
        id="content"
        class="headline
          font-weight-bold
          white--text
          text-xs-center"
      >
        A simplistic solution to fitness logging.
      </div>
      <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
      >
        Login session timed out!
        <v-btn
          color="blue"
          text
          @click="this.closeSessionTimeout"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'welcome',
  data() {
    return {
      snackbar: false,
      timeout: 2000,
    }
  },
  computed: {
    ...mapState([
      'sessionTimeout',
    ]),
  },
  methods: {
    ...mapActions([
      'closeSessionTimeout',
    ]),
  },
};
</script>

<style scoped>
#welcome {
    background-color: orangered;
    background-size: cover;
    width: 100%;
    height: 100%;
}
#content {
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}
</style>

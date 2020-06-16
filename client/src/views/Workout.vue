<template>
  <v-container fluid>
    <v-btn
      @click="this.openAddExercise"
      color="deep-orange darken-4"
      block
      large
      dark
    >
      Add Exercise
    </v-btn>
    <br>
    <v-card>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Workout',
  data() {
    return {
    };
  },
  computed: {
    ...mapState([
      'addExerciseScreen',
    ]),
  },
  components: {
  },
  methods: {
    ...mapActions([
      'openAddExercise',
    ]),
  },
};
</script>
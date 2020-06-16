<template>
  <v-dialog
    v-model="newExerciseScreen"
  >
    <v-card>
      <v-toolbar dark color="deep-orange darken-4">
        <v-toolbar-title>New Exercise</v-toolbar-title>
        <div class="flex-grow-1"></div>
      </v-toolbar>
      <v-card-text class="pt-2">
        <v-text-field
          required
          label="Exercise name"
          v-model="newExercise.name"
        ></v-text-field>
        <v-text-field
          required
          label="Exercise group"
          v-model="newExercise.group"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn 
          text
          color="primary"
          @click="this.closeNewExercise"
        >
          Close
        </v-btn>
        <v-btn 
          text
          color="primary"
          @click="createNewExercise()"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'NewExercise',
  data() {
    return {
      exercises: ['memes', 'guy', 'dude'],
      newExercise: {
        name: '',
        group: '',
      },
    };
  },
  computed: {
    ...mapState([
      'newExerciseScreen',
    ]),
  },
  components: {
  },
  methods: {
    ...mapActions([
      'closeNewExercise',
      'closeAddExercise',
      'addExercise',
    ]),
    createNewExercise() {
      this.$http.post('http://127.0.0.1:5000/newExercise', {
        name: this.newExercise.name,
        group: this.newExercise.group,
      }, {
        headers: {
          Authorization: `Bearer ${this.$store.state.accessToken}`,
        },
      })
        .then(response => {
          this.addExercise(response.data);
          this.closeNewExercise();
          this.closeAddExercise();
        });
    },
  },
};
</script>

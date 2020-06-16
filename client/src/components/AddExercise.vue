<template>
  <v-dialog
    v-model="this.addExerciseScreen"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar dark color="deep-orange darken-4">
        <v-btn icon dark @click="this.closeAddExercise">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Add Exercise</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-btn
          @click="this.openNewExercise"
          color="gray darken-4"
          fab
          dark
          small
          absolute
          bottom
          right
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <br>
      <v-list-item-group>
        <template v-for="(item, index) in exercises">
          <v-list-item :key="item.name">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-card>
    <new-exercise/>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import NewExercise from './NewExercise.vue';

export default {
  name: 'AddExercise',
  data() {
    return {
    };
  },
  computed: {
    ...mapState([
      'addExerciseScreen',
      'newExerciseScreen',
      'exercises',
    ]),
  },
  components: {
    NewExercise,
  },
  methods: {
    ...mapActions([
      'closeAddExercise',
      'openNewExercise',
      'addExercise',
    ]),
  },
  mounted() {
    this.$http.get("http://127.0.0.1:5000/getExercises", {
      headers: {
        Authorization: `Bearer ${this.$store.state.accessToken}`,
      },
    })
      .then(response => {
        var json = response.data
        for(var i = 0; i < json.length; i++) {
          this.addExercise(json[i]);
        }
      });
  },
};
</script>

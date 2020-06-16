<template>
  <v-dialog v-model="this.nameScreen" persistent max-width="400px">
    <v-card>
      <v-card-title class="headline">
        Change Name
      </v-card-title>
      <v-alert
        class="ma-1"
        v-model="alert"
        type="error"
        dense
      >
        {{ err_msg }}
      </v-alert>
      <br>
      <v-card-text>
        <v-text-field
          v-model="firstName"
          outlined
          label="First Name"
        ></v-text-field>
        <v-text-field
          v-model="lastName"
          outlined
          label="Last Name"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="deep-orange darken-1" text @click="this.closeName">Close</v-btn>
        <v-btn color="deep-orange darken-1" text @click="submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ChangeName',
  data() {
    return {
      firstName: '',
      lastName: '',
      err_msg: '',
      alert: false,
    };
  },
  computed: {
    ...mapState([
      'nameScreen',
      'account',
    ]),
  },
  components: {
  },
  methods: {
    ...mapActions([
      'closeName',
      'setAccount',
    ]),
    submit() {
      this.alert = false;

      if (this.firstName || this.lastName) {
        this.$http.post('http://127.0.0.1:5000/changeName', {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.account.email,
        }, {
          headers: {
            Authorization: `Bearer ${this.$store.state.accessToken}`,
          },
        })
          .then((res) => {
            this.setAccount(res.data);
            this.closeName();
          })
          .catch((err) => {
            this.err_msg = 'There was an error!'
            this.alert = true;
          });
      } else {
        this.err_msg = 'You must enter a new first or last name!'
        this.alert = true;
      }
    }
  },
};
</script>

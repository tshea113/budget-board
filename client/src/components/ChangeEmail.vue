<template>
  <v-dialog v-model="this.emailScreen" persistent max-width="400px">
    <v-card>
      <v-card-title class="headline">
        Change Email
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
          v-model="email"
          outlined
          label="Email"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="deep-orange darken-1" text @click="this.closeEmail">Close</v-btn>
        <v-btn color="deep-orange darken-1" text @click="submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ChangeEmail',
  data() {
    return {
      email: '',
      err_msg: '',
      alert: false,
    };
  },
  computed: {
    ...mapState([
      'emailScreen',
      'account',
    ]),
  },
  components: {
  },
  methods: {
    ...mapActions([
      'closeEmail',
      'setAccount',
    ]),
    submit() {
      this.alert = false;

      if (this.email) {
        this.$http.post('http://127.0.0.1:5000/changeEmail', {
          firstName: this.account.firstName,
          lastName: this.account.lastName,
          email: this.email,
        }, {
          headers: {
            Authorization: `Bearer ${this.$store.state.accessToken}`,
          },
        })
          .then((res) => {
            this.setAccount(res.data);
            this.closeEmail();
          })
          .catch((err) => {
            this.err_msg = 'There was an error!'
            this.alert = true;
            console.log(err);
          });
      } else {
        this.err_msg = 'You must enter a new email!'
        this.alert = true;
      }
    }
  },
};
</script>

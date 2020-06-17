<template>
  <v-dialog v-model="signupScreen" :fullscreen="$vuetify.breakpoint.smAndDown" persistent max-width="600px">
    <v-card>
        <v-toolbar color="grey darken-4" class="elevation-5" dark>
          <v-toolbar-title class="display-1 mx-4">Sign up</v-toolbar-title>
        </v-toolbar>
        <v-alert
          class="ma-1"
          v-model="alert"
          type="error"
          dense
        >
          {{ err_msg }}
        </v-alert>
        <v-alert
          class="ma-1"
          v-model="success"
          type="success"
          dense
        >
          {{ succ_msg }}
        </v-alert>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="first_name"
                  outlined label="First Name"
                  required
                  ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="last_name"
                  outlined label="Last Name"
                  required
                  ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  outlined
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  required
                  ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  outlined
                  label="Password"
                  prepend-inner-icon="mdi-key"
                  type="password"
                  required
                  ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="this.closeSignup">Close</v-btn>
          <v-btn color="blue darken-1" text @click="signup">Submit</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Signup',
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      err_msg: '',
      succ_msg: '',
      alert: false,
      success: false,
    };
  },
  computed: {
    ...mapState([
      'signupScreen',
    ]),
  },
  components: {
  },
  methods: {
    ...mapActions([
      'setAccessToken',
      'closeSignup',
    ]),
    signup() {
      this.alert = false;
      this.success = false;

      this.$http.post('http://127.0.0.1:5000/signup', {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
      })
        .then((res) => {
          this.succ_msg = 'Account successfully created!';
          this.success = true;
        })
        .catch((err) => {
          this.err_msg = err.response.data;
          this.alert = true;
        });
    },
  },
};
</script>

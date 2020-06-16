<template>
  <v-dialog v-model="this.loginScreen" persistent max-width="600px">
    <v-card>
      <v-toolbar color="deep-orange darken-4" class="elevation-5" prominent dark>
        <v-toolbar-title class="display-1 mx-4">Login</v-toolbar-title>
      </v-toolbar>
      <v-alert
        class="ma-1"
        v-model="alert"
        type="error"
        dense
      >
        {{ err_msg }}
      </v-alert>
      <v-card-text>
        <v-container>
          <v-row>
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
        <v-btn color="deep-orange darken-1" text @click="this.closeLogin">Close</v-btn>
        <v-btn color="deep-orange darken-1" text @click="login">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      err_msg: '',
      alert: false,
    };
  },
  computed: {
    ...mapState([
      'loginScreen',
    ]),
  },
  components: {
  },
  methods: {
    ...mapActions([
      'setAccessToken',
      'closeLogin',
    ]),
    login() {
      this.alert = false;

      this.$http.post('http://127.0.0.1:5000/login', {
        email: this.email,
        password: this.password,
      })
        .then((res) => {
          this.setAccessToken(res.data.token);
          this.$router.push({ path: '/dashboard' });
          this.email = '';
          this.password = '';
          this.closeLogin();
        })
        .catch((err) => {
          if (err.response) {
            this.err_msg = err.response.data.message;
            this.alert = true;
          }
        });
    },
  },
};
</script>

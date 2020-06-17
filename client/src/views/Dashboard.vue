<template>
    <v-container
      fluid
    >
      <v-row>
        <v-col
          cols="12"
          md="2"
        >
          <v-card
            class="d-flex flex-row"
            height="100%"
          >
            <v-card-title
              class="title"
            >
              Hello, {{ this.account.firstName }}!
            </v-card-title>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <v-card height="100%">
            <v-card-text>
              <div>Test Card</div>
              <p class="display-1 text--primary">
                This is a test card
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <v-card height="100%">
            <v-card-text>
              <div>Another Test Card</div>
              <p class="display-1 text--primary">
                This is another test card
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
      </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'dashboard',
  data() {
    return {
      message: '',
    };
  },
  computed: {
    ...mapState([
      'account',
    ]),
  },
  components: {
  },
  methods: {
    ...mapActions([
      'fetchAccessToken',
      'setAccount',
    ]),
  },
};
</script>

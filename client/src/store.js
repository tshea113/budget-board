import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: {
      firstName: null,
      lastName: null,
      email: null,
    },
    exercises: [],
    accessToken: null,
    loginScreen: false,
    signupScreen: false,
    accountScreen: false,
    nameScreen: false,
    emailScreen: false,
    addExerciseScreen: false,
    newExerciseScreen: false,
    sessionTimeout: false,
  },
  mutations: {
    updateAccount: (state, accountInfo) => {
      if (accountInfo.firstName) {
        state.account.firstName = accountInfo.firstName;
      }
      if (accountInfo.lastName) {
        state.account.lastName = accountInfo.lastName;
      }
      if (accountInfo.email) {
        state.account.email = accountInfo.email;
      }
    },
    updateAccessToken: (state, accessToken) => {
      state.accessToken = accessToken;
    },
    addExercise: (state, exercise) => {
      state.exercises.push(exercise);
    },
    toggleLogin: (state, action) => {
      state.loginScreen = action;
    },
    toggleSignup: (state, action) => {
      state.signupScreen = action;
    },
    toggleAccount: (state, action) => {
      state.accountScreen = action;
    },
    toggleName: (state, action) => {
      state.nameScreen = action;
    },
    toggleEmail: (state, action) => {
      state.emailScreen = action;
    },
    toggleTimeout: (state, action) => {
      state.sessionTimeout = action;
    },
    toggleAddExercise: (state, action) => {
      state.addExerciseScreen = action;
    },
    toggleNewExercise: (state, action) => {
      state.newExerciseScreen = action;
    },
  },
  actions: {
    // Setters and Getters
    setAccount({ commit }, accountInfo) {
      commit('updateAccount', accountInfo);
    },
    deleteAccount({ commit }) {
      commit('updateAccount', {
        firstName: null,
        lastName: null,
        email: null,
      });
    },
    setAccessToken({ commit }, token) {
      localStorage.setItem('token', token);
      this.state.loggedIn = true;
      commit('updateAccessToken', token);
    },
    fetchAccessToken({ commit }) {
      commit('updateAccessToken', localStorage.getItem('token'));
    },
    addExercise({ commit }, exercise) {
      commit('addExercise', exercise);
    },
    logout({ commit }) {
      localStorage.clear();
      this.state.loggedIn = false;
      commit('updateAccessToken', null);
    },
    // Open and Close Dialogs
    openLogin({ commit }) {
      commit('toggleLogin', true);
    },
    closeLogin({ commit }) {
      commit('toggleLogin', false);
    },
    openSignup({ commit }) {
      commit('toggleSignup', true);
    },
    closeSignup({ commit }) {
      commit('toggleSignup', false);
    },
    openAccount({ commit }) {
      commit('toggleAccount', true);
    },
    closeAccount({ commit }) {
      commit('toggleAccount', false);
    },
    openName({ commit }) {
      commit('toggleName', true);
    },
    closeName({ commit }) {
      commit('toggleName', false);
    },
    openEmail({ commit }) {
      commit('toggleEmail', true);
    },
    closeEmail({ commit }) {
      commit('toggleEmail', false);
    },
    openSessionTimeout({ commit }) {
      commit('toggleTimeout', true);
    },
    closeSessionTimeout({ commit }) {
      commit('toggleTimeout', false);
    },
    openAddExercise({ commit }) {
      commit('toggleAddExercise', true);
    },
    closeAddExercise({ commit }) {
      commit('toggleAddExercise', false);
    },
    openNewExercise({ commit }) {
      commit('toggleNewExercise', true);
    },
    closeNewExercise({ commit }) {
      commit('toggleNewExercise', false);
    },
  },
});

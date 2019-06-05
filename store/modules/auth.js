import api from '../api'

const state = {
  user: null
}

const actions = {
  logInUser: ({ commit }, data) => {
    return api
      .logIn(data.email, data.password)
      .then(user => commit('setUser', user.user))
  },

  logOutUser: ({ state, commit }) => {
    return api.logOut().then(() => commit('setUser', null))
  },

  signUpUser: ({ commit }, email) => {
    return api.signUp(email)
  }
  /*


forgotPassword: ({ commit }, data) => {
  return api.forgetPassword(data.email).then(user => commit('setUser', null))
},

deleteAccount: ({ state, commit, rootState }) => {
  return api
    .deleteAccount(rootState.auth.user.uid)
    .then(() => commit('setUser', null))
},

verifyEmail: ({ state, commit, rootState }) => {
  const uid = rootState.auth.user.uid
  return api
    .resendEmailbyId(uid)
    .then(status => commit('setResentEmail', status))
}
*/
}

const mutations = {
  setUser(state, user) {
    // console.log('setUser', user)
    state.user = user
  }
}

const getters = {
  user: state => {
    return state.user
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}

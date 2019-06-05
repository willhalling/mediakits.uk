import Vue from 'vue'
import Vuex from 'vuex'

import global from './modules/global'
import auth from './modules/auth'
import storage from './modules/storage'
import database from './modules/database'
import user from './modules/user'

Vue.use(Vuex)

export const strict = false

export default () =>
  new Vuex.Store({
    modules: {
      global,
      auth,
      storage,
      database,
      user
    },
    strict
  })

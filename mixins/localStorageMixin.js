import ls from 'local-storage'

export const localStorageMixin = {
  methods: {
    ls_pullUser() {
      return ls.get('user')
    },
    ls_pushUser(user) {
      ls.set('user', user)
    },
    ls_pushStore(store) {
      ls.set('bbm_store', store)
    }
  }
}

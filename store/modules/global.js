const state = {
  page: 'add-date-or-age-stamp-to-your-photos.vue',
  step: 1,
  loading: false,
  canvasNav: {
    text: {
      open: false
    }
  },
  isMediumSize: false
}

const actions = {
  nextStepAction: ({ commit }) => {
    commit('nextStep')
  },
  previousStepAction: ({ state, commit }) => {
    commit('previousStep')
  }
}

const mutations = {
  updatePage(state, pageName) {
    state.page = pageName
  },
  previousStep(state) {
    state.step = state.step - 1
  },
  nextStep(state) {
    state.step = state.step + 1
  },
  goToStep(state, step) {
    state.step = step
  },
  updateLoading(state, loading) {
    state.loading = loading
  },
  canvasNavOpen(state, type) {
    state.canvasNav[type].open = true
  },
  canvasNavClose(state, type) {
    state.canvasNav[type].open = false
  },
  updateIsMediumSize(state, isMediumSize) {
    state.isMediumSize = isMediumSize
  }
}

const getters = {
  step: state => {
    return state.step
  },
  loading: state => {
    return state.loading
  },
  canvasNav: state => {
    return state.canvasNav
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}

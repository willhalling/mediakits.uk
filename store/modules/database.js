import api from '../api'

const state = {
  files: [],
  filters: [],
  svgs: [],
  total: 0
}

const actions = {
  addFile: ({ state, commit }, referenceData) => {
    return api
      .addFileReference(referenceData)
      .then(fileData => commit('setFilesData', fileData))
  },
  getFilters: ({ state, commit }) => {
    return api
      .getAllFilterNames()
      .then(filters => commit('setFilters', filters))
  },
  getSvgsByFilter: ({ state, commit }, filter) => {
    // console.log('database getSvgsByFilter', filter)
    return api.getSvgsByFilter(filter).then(response => {
      response.svgs.forEach(svg => {
        commit('setSvgs', svg)
      })
      return response
    })
  },
  getSvgsBySearch: ({ state, commit }, search) => {
    return api.getSvgsBySearch(search).then(response => {
      commit('resetSvgs')
      response.svgs.forEach(svg => {
        commit('setSvgs', svg)
      })
      return response
    })
  },
  removeSvg: ({ state, commit }, svg) => {
    return api.removeSvgReferences(svg).then(response => {
      commit('removeSvg', response.id)
    })
  }
}

const mutations = {
  setFilesData(state, fileData) {
    state.files.push(fileData)
  },
  setFilters(state, filters) {
    state.filters = filters
  },
  setSvgs(state, svg) {
    state.svgs.push(svg)
  },
  removeSvg(state, svgId) {
    state.svgs = state.svgs.filter(svg => {
      return svg.id !== svgId
    })
  },
  resetSvgs(state) {
    state.svgs = []
  }
}

const getters = {
  files: state => {
    return state.files
  },
  filters: state => {
    return state.filters
  },
  svgs: state => {
    return state.svgs
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}

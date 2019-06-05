import api from '../api'

const state = {
  // @todo: remove downloadData as no longer needed now we are using response to retrieve download url.
  downloadData: []
}

const actions = {
  uploadFile: ({ state, commit, rootState }, file) => {
    return api.uploadToStorage(file).then(downloadData => {
      commit('setDownloadData', downloadData)
      return downloadData
    })
  }
}

const mutations = {
  setDownloadData(state, downloadUrl) {
    state.downloadData.push(downloadUrl)
  }
}

const getters = {
  downloadData: state => {
    return state.downloadData
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}

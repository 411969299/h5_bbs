import * as T from '../mutation-types'

const state = {
  favorMeLists: [],
  favoredLists: [],
  favorLists: []
}

const mutations = {
  [T.GETFAVORMELIST] (state, data) {
    state.favorMeLists = data
  },

  [T.GETFAVOREDLIST] (state, data) {
    state.favoredLists = data
  },

  [T.GETFAVORLIST] (state, data) {
    state.favorLists = data
  }
}

export default {
  state,
  mutations
}

import * as T from '../mutation-types'

const state = {
  myPostLists: [],
  deleteStatus: false
}

const mutations = {
  [T.GETMYPOSTLIST] (state, data) {
    state.myPostLists = data
  },

  [T.DELETE_POST] (state, data) {
    state.deleteStatus = data
  }
}

export default {
  state,
  mutations
}

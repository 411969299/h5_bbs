import * as T from '../mutation-types'

const state = {
  replyMeLists: [],
  repliedLists: [],
  deleteStatus: false
}

const mutations = {
  [T.GETREPLYMELIST] (state, data) {
    state.replyMeLists = data
  },

  [T.GETREPLIEDLIST] (state, data) {
    state.repliedLists = data
  },

  [T.DELETE_REPLY] (state, data) {
    state.deleteStatus = data
  }
}

export default {
  state,
  mutations
}

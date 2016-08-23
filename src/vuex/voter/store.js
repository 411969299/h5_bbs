import * as T from '../mutation-types'

const state = {
  voterLists: [],
  tatal: 0
}

const mutations = {
  [T.GETVOTERLIST] (state, data) {
    state.voterLists = data.userInfoList
    state.tatal = data.tatal
  }
}

export default {
  state,
  mutations
}

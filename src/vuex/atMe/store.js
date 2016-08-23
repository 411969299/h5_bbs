import * as T from '../mutation-types'

const state = {
  lists: []
}

const mutations = {
  [T.GETATMELIST] (state, data) {
    state.lists = data
  }
}

export default {
  state,
  mutations
}

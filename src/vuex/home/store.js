import * as T from '../mutation-types'

const state = {
  lists: [],
  activityLists: [],
  atNum: 0,
  replyNum: 0,
  likeNum: 0,
  userInfo: null
}

const mutations = {
  [T.GETHOMELIST] (state, data) {
    state.lists = data.bbsList
    state.activityLists = data.activityBbsList
    state.atNum = data.atNum
    state.replyNum = data.replyNum
    state.likeNum = data.likeNum
  },

  [T.GETUSERDETAIL] (state, data) {
    state.userInfo = data
  }
}

export default {
  state,
  mutations
}

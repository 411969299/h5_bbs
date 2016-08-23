import * as T from '../mutation-types'

const state = {
  summary: {},
  postList: [],
  actList: [],
  detail: {},
  replys: []
}

const mutations = {
  // 页面请求
  [T.FORUM_SUMMARY] (state, data) {
    state.summary = data
  },
  [T.FORUM_POST_LIST] (state, data) {
    state.postList = data
  },
  [T.FORUM_ACTIVITY_LIST] (state, data) {
    state.actList = data
  },
  [T.FORUM_DETAIL] (state, data) {
    state.detail = data
  },
  [T.FORUM_DETAIL_REPLAYS] (state, data) {
    state.replys = data
  },
  // 页面操作
  [T.FORUM_VOTE_AGREE] (state, data) {
    state.detail.canVote = 0
    state.detail.agreeNum ++
  },
  [T.FORUM_VOTE_DISAGREE] (state, data) {
    state.detail.canVote = 0
    state.detail.disAgreeNum ++
  },
  [T.FORUM_PAY_TO_JOIN] (state, data) {
    state.detail.canJoin = 0
  },
  [T.FORUM_MORE_REPLY] (state, data) {
    let replys = state.replys.concat()
    replys.map((item) => {
      if (item.fristReplyId === data.replysId) {
        item.secondReplys = item.secondReplys.concat(data.result)
        return
      }
    })
    state.replys = replys
  },
  [T.FORUM_SWITCH_LIKE_OR_NOT] (state, data) {
    state.detail.likeOrNot = data
  }
}

export default {
  state,
  mutations
}

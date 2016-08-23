import * as T from '../mutation-types'

const state = {
  clockLists: [],
  myClockInfo: {},
  clockRecordList: [],
  finishDays: 0,
  goalDays: 0,
  rank: 0,
  isMyRecord: false,
  todayStatus: false,
  serialTimes: 0,
  scale: 0
}

const mutations = {
  [T.GETCLOCKLIST] (state, data) {
    state.clockLists = data.clockRank
    state.myClockInfo = {
      avatar: data.avatar,
      clockNumber: data.clockNumber,
      fullname: data.fullname,
      rank: data.rank,
      userId: data.userId
    }
  },

  [T.GETCLOCKRECORD] (state, data) {
    state.clockRecordList = data.clockRecordList
    state.finishDays = data.finishDays
    state.goalDays = data.goalDays
    state.rank = data.rank
    state.isMyRecord = (data.isMyRecord === 1)
    state.todayStatus = (data.todayStatus === 1)
    state.serialTimes = data.serialTimes
    state.scale = data.finishDays / data.goalDays
  }
}

export default {
  state,
  mutations
}

import * as T from '../mutation-types'
import Request from '../../utils/request'

export const getReplyMeList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/reply-me',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETREPLYMELIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

export const getRepliedList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/i-reply',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETREPLIEDLIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

export const deleteReply = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/delete-reply',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.DELETE_REPLY, data)
  }).catch((err) => {
    console.log(err)
  })
}

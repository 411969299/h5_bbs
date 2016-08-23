import * as T from '../mutation-types'
import Request from '../../utils/request'

export const getFavorMeList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/like-me',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETFAVORMELIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

export const getFavoredList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/i-like',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETFAVOREDLIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

export const getFavorList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/post-like-list',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETFAVORLIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

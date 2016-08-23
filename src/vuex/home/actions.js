import * as T from '../mutation-types'
import log from '../../utils/logger'
import Request from '../../utils/request'

export const getHomeList = ({ dispatch, state }, success, fail) => {
  Request.get({
    url: '/v3/bbs/bbs-home'
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETHOMELIST, data)
  }).catch((err) => {
    log.error(err)
  })
}

export const getUserDetail = ({ dispatch, state }) => {
  Request.get({
    url: '/v3/user/detail'
  }).then((res) => {
    if (res.code !== 1) {
      return
    }
    let data = res.result
    dispatch(T.GETUSERDETAIL, data)
  }).catch((err) => {
    log.error(err)
  })
}

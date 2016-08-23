import * as T from '../mutation-types'
import log from '../../utils/logger'
import Request from '../../utils/request'

export const getAtMeList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/at-me',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETATMELIST, data)
  }).catch((err) => {
    log.error(err)
  })
}

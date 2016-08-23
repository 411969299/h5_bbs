import * as T from '../mutation-types'
import Request from '../../utils/request'

export const getClockList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/clock-rank',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETCLOCKLIST, data)
  }).catch(function (err) {
    console.log(err)
  })
}

export const getClockRecord = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/clock-record',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETCLOCKRECORD, data)
  }).catch((err) => {
    console.log(err)
  })
}

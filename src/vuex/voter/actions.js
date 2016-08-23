import * as T from '../mutation-types'
import Request from '../../utils/request'

export const getVoterList = ({ dispatch, state }, data) => {
  Request.get({
    url: '/v3/bbs/voter-list',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      return
    }
    let data = res.result
    dispatch(T.GETVOTERLIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

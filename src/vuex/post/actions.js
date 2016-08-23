import * as T from '../mutation-types'
import Request from '../../utils/request'

export const getMyPostList = ({ dispatch, state }, data, success, fail) => {
  Request.get({
    url: '/v3/bbs/my-posts',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    success && success()
    let data = res.result
    dispatch(T.GETMYPOSTLIST, data)
  }).catch((err) => {
    console.log(err)
  })
}

export const deletePost = ({ dispatch, state }, data, success, fail) => {
  Request.post({
    url: '/v3/bbs/delete-post',
    data: data
  }).then((res) => {
    if (res.code !== 1) {
      fail && fail()
      return
    }
    let data = res.result
    success && success()
    dispatch(T.DELETE_POST, data)
  }).catch((err) => {
    console.log(err)
  })
}

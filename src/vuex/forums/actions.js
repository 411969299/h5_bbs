import * as T from '../mutation-types'
import log from '../../utils/logger'
import Request from '../../utils/request'

const getForumSummary = ({dispatch}, bbsId, channelId) => {
  Request.get({
    url: '/v3/bbs/bbs-info',
    data: {
      bbs_id: bbsId,
      channel_id: channelId
    }
  }).then((res) => {
    // res = {
    //   'code': 1,
    //   'result': {
    //     'bbsId': 1,
    //     'bbsName': '',
    //     'bbsType': 2,               // 论坛类型 1活动论坛 2普通论坛 3打卡论坛
    //     'bbsAvatar': null,          // 论坛头像
    //     'bbsMemberNum': 560,        // 论坛人数
    //     'bbsPostNum': 6,            // 论坛帖子数
    //     'bbsIntroduction': '',      // 论坛简介
    //     'bbsManagers': [
    //       {
    //         'userId': '571f55a2357ca04722f8823d',
    //         'avatar': 'http://o4a7cbihz.qnssl.com/avatar/59279eb3-5cc6-4013-8e7c-37dd4003f622',
    //         'userName': '小姐开心开心开心快点快点快点快点看就放假',
    //         'createdAt': null
    //       },
    //       {
    //         'userId': '56d448177ebb20624f7545bc',
    //         'avatar': 'http://7xo06a.com1.z0.glb.clouddn.com/avatar/275b9b49-9c59-43b7-bac7-ff5331be6099',
    //         'userName': '李笑来',
    //         'createdAt': null
    //       }
    //     ],
    //     'channelId': '576dc9c29e3f76491832b4d7',
    //     'canJoin': 0
    //   }
    // }
    dispatch(T.FORUM_SUMMARY, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

const getForumPostList = ({dispatch}, data) => {
  Request.get({
    url: '/v3/bbs/all-post',
    data: data
  }).then((res) => {
    if (res.code === 0) {
      return
    }
    dispatch(T.FORUM_POST_LIST, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

const getForumActList = ({dispatch}, data) => {
  Request.get({
    url: '/v3/bbs/activity-post',
    data: data
  }).then((res) => {
    if (res.code === 0) {
      return
    }
    dispatch(T.FORUM_ACTIVITY_LIST, res.result)
  }).catch((err) => {
    log.error(err)
  })
}

const getForumDetail = ({dispatch}, data) => {
  Request.get({
    url: '/v3/bbs/post-details-post',
    data: data
  }).then((res) => {
    if (res.code === 0) {
      return
    }
    dispatch(T.FORUM_DETAIL, res.result)
  })
  .catch(function (err) {
    log.error(err)
  })
}
const getDetailReplys = ({dispatch}, data) => {
  Request.get({
    url: '/v3/bbs/post-details-replys',
    data: data
  }).then((res) => {
    if (res.code === 0) {
      return
    }
    dispatch(T.FORUM_DETAIL_REPLAYS, res.result)
  }).catch(function (err) {
    log.error(err)
  })
}

const getMoreReplys = ({ dispatch }, params) => {
  /* eslint-disable */
  // Request.get({
  //   url: 'v3/bbs/more-reply',
  //   data: {
  //     post_id: params.postId,
  //     first_reply_id: params.firstReplyId
  //   }
  // }).then(function (res) {
  //   res = {
  //     'code': 1,
  //     'result':
  //     [              //二级回复
  //         {
  //           'id':11111111,
  //           'fullname':'米雪',
  //           'userId':'1211',
  //           'message':'太好了，期待',
  //           'messageType':1,        //内容类型 1: 文字, 2:语音, 3:图片
  //           'canDelete':0           //是否有删除权限 0没有 1有
  //         }
  //     ]
  //   }
  //   dispatch(T.FORUM_MORE_REPLY, res.result)
  // }).catch(function (err) {
  //   log.error(err)
  // })

  // const res = {
  //   'code': 1,
  //   'result':
  //   [              //二级回复
  //       {
  //         'id':12345,
  //         'fullname':'米雪',
  //         'userId':'1211',
  //         'message':'太好了，期待',
  //         'messageType':1,        //内容类型 1: 文字, 2:语音, 3:图片
  //         'canDelete':0           //是否有删除权限 0没有 1有
  //       }
  //   ]
  // }
  dispatch(T.FORUM_MORE_REPLY, {
    result: res.result,
    replysId: params.firstReplyId
  })
}

// 投票（完成度)
const vote = ({ dispatch }, params) => {
  Request.post({
    url: '/v3/bbs/vote',
    data: {
      post_id: params.post_id,
      is_agree: params.is_agree
    }
  }).then(function (res) {
    if (res.result) {
      if (params.is_agree) {
        dispatch(T.FORUM_VOTE_AGREE)
      } else {
        dispatch(T.FORUM_VOTE_DISAGREE)
      }
    } else {
      log.error(res)
    }
  }).catch(function (err) {
    log.error(err)
  })
}

// 支付加入活动
const payToJoin = ({ dispatch }, params) => {
  dispatch(T.FORUM_PAY_TO_JOIN);
}

// 点赞或取消点赞
const likeOrCancel = ({ dispatch }, data) => {
  Request.post({
    url: '/v3/bbs/like-or-cancel',
    data: data
  }).then((res) => {
    if (res.code === 1) {
      if (data.like_type === 1) {
        dispatch(T.FORUM_SWITCH_LIKE_OR_NOT, 1)
        // 提示成功点赞
      } else {
        dispatch(T.FORUM_SWITCH_LIKE_OR_NOT, 2)
        // 提示成功取消点赞
      }
    } else {
      // 失败
      return
    }
  }).catch((err) => {
    log.error(err)
  })
}

export {
  getForumSummary,
  getForumPostList,
  getForumActList,
  getForumDetail,
  getDetailReplys,
  vote,
  payToJoin,
  getMoreReplys,
  likeOrCancel
}

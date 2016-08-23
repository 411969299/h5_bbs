<style lang="less">
  @import "../../styles/base/base-750";
  @import './index';
</style>

<template>
  <div class="forum_list">
    <div class="forum_head">
      <div class="img">
        <img :src="summary.bbsAvatar" />
      </div>
      <div class="det">
        <ul>
          <li v-if="summary.bbsType !== bbsType.ACT_BBS">人数<span>{{ summary.bbsMemberNum }}</span></li>
          <li>帖子<span>{{ summary.bbsPostNum }}</span></li>
        </ul>
        <div class="moderator">
          <span class="moderator_text">版主</span>
          <div class="avatar_wrap" v-if="summary.bbsManagers && summary.bbsManagers.length > 4">
            <img v-for="n in 4" class="manager_avatar" :src="summary.bbsManagers[n].avatar" alt="avatar" />
            <span class="dots">···</span>
          </div>
          <div class="avatar_wrap" v-else>
            <img v-for="key in summary.bbsManagers" class="manager_avatar" :src="key.avatar" alt="avatar" />
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>

    <div class="forum_body">
      <div class="title">
        <ul>
          <li id="t_0" :class="{ f:allPosts == 0 }" @click="switchTab(0)" >
            <span>看帖</span>
            <div class="tab_bottom_bar_wrap">
              <span class="bottom_bar"></span>
            </div>
          </li>
          <li id="t_1" :class="{ f:allPosts == 1 }" @click="switchTab(1)" v-if="summary.bbsType === bbsType.TASK_BBS">
            <span>打卡贴</span>
            <div class="tab_bottom_bar_wrap">
              <span class="bottom_bar"></span>
            </div>
          </li>
        </ul>
      </div>

      <div
        v-show="allPosts == 0"
        class="con"
      >
        <ul class="posts_list_wrap">
          <li v-for="key in postList" class="f_list">
            <div>
              <div class="avatar_wrap" >
                <img :src="key.createrAvatar" alt="avatar" @click="getUserInfo(key.createrId)" data-ignore="1" />
              </div>
              <div class="content_section" v-link="{ path: '/forum_detail?postId=' + key.postId }">
                <div class="content">
                  <div class="text_content">
                    <div class="name">{{ key.createrName }}</div>
                    <div class="text_title">
                      <p>
                        <span v-if="key.postType === config.postType.punch" class="isdk">
                          打卡
                        </span>
                        {{ key.postTitle }}
                      </p>
                    </div>
                  </div>
                  <div v-if="key.postImage" class="img_content">
                    <img :src="key.postImage" alt="avatar" />
                  </div>
                </div>
                <div class="details">
                  <span class="time">{{ key.createdAt | dateFormat }}</span>
                  <div class="operate">
                    <i class="icon-thumbs-c operate_icon"><span>{{ key.likeNum }}</span></i>
                    <i class="icon-comment-c operate_icon"><span>{{ key.replyNum }}</span></i>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="loading" v-show="loading">
          <div v-if="!allLoaded">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
          </div>
          <div v-else>没有更多了</div>
        </div>
      </div>

      <div
        v-show="allPosts == 1"
        v-if="summary.bbsType === bbsType.TASK_BBS"
        class="con">
        <ul class="act_list_wrap">
          <li v-for="key in actList" class="f_list">
            <div>
              <div class="avatar_wrap">
                <img :src="key.createrAvatar" alt="avatar" @click="getUserInfo(key.createrId)" data-ignore="1" />
              </div>
              <div class="content_section" v-link="{ path: '/forumdetail?post_id=' + key.postId }">
                <div class="content">
                  <div class="text_content">
                    <div class="name">{{ key.createrName }}</div>
                    <div class="text_title">
                      <p>
                        <span v-if="key.postType === config.postType.punch" class="isdk">
                          打卡
                        </span>
                        {{ key.postTitle }}
                      </p>
                    </div>
                  </div>
                  <div v-if="key.postImage" class="img_content">
                    <img :src="key.postImage" alt="avatar" />
                  </div>
                </div>
                <div class="details">
                  <span class="time">{{ key.createdAt | dateFormat }}</span>
                  <div class="operate">
                    <i class="icon-thumbs-c operate_icon"><span>{{ key.likeNum }}</span></i>
                    <i class="icon-comment-c operate_icon"><span>{{ key.replyNum }}</span></i>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="loading" v-show="loading">
          <div v-if="!allLoaded">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
          </div>
          <div v-else>没有更多了</div>
        </div>
      </div>
    </div>

    <div v-if="summary.bbsType !== bbsType.ACT_BBS" class="forum_action">
      <div class="punch"
      v-if="(summary.bbsType === bbsType.TASK_BBS) && summary.canJoin === 1"
      v-link="{path: 'clock_record?bbsId=' + bbsId + '&isMy=1&channelId=' + channelId + '&userName=' + userName + '&sharable＝1'}">
        我要打卡
      </div>
      <div v-if="(summary.bbsType === bbsType.TASK_BBS) && summary.canJoin === 0" class="punched">
        我已打卡
      </div>
      <i v-if="summary.bbsType === bbsType.TASK_BBS"></i>
      <div @click="publishNormalPost(bbsId, channelId)" class="posting">我要发帖</div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    getForumPostList,
    getForumActList,
    getForumSummary
  } from '../../vuex/forums/actions'
  import {
    MessageBox,
    Spinner,
    Indicator
  } from 'mint-ui'
  import postConfig from '../../constants/postType'
  import bbsConfig from '../../constants/bbsType'
  import $ from 'npm-zepto'

  Vue.component(Spinner.name, Spinner)

  export default {
    data () {
      return {
        allPosts: 0,
        loading: false,
        allLoaded: false,
        config: postConfig,
        bbsType: bbsConfig,
        userName: '',
        postList: [],
        actList: [],
        page_1: 1,
        page_2: 1,
        limit: 10
      }
    },
    vuex: {
      getters: {
        bbsId: state => state.route.query.bbsId,
        channelId: state => state.route.query.channelId,
        summary: state => state.forums.summary,
        statePostList: state => state.forums.postList,
        stateActList: state => state.forums.actList
      },
      actions: {
        getForumPostList,
        getForumActList,
        getForumSummary
      }
    },
    ready () {
      this.userName = window.localStorage.getItem('userName')
      $(window).scroll(() => {
        let sh = $(window).scrollTop()
        let wh = $(window).height()
        let dh = $(document).height()
        if (dh - sh - wh < 30) {
          this.loading = true
        }
      })
      // 发帖状态监听方法
      let sendMsgListener = (data) => {
        // return window.alert(JSON.stringify(data))
      }
      if (!window.tinfiniteListener) {
        window.tinfiniteListener = {}
      }
      window.tinfiniteListener.sendMsgListener = sendMsgListener
    },
    created () {
      Indicator.open('加载中...')
      this.getForumSummary(this.bbsId, this.channelId)
      this.loadMore()
    },
    methods: {
      switchTab (num) {
        this.allPosts = num
        if (num === 1 && !this.actList.length) {
          this.getForumActList(this.bbsId)
        }
      },
      msgalert () {
        MessageBox.confirm('请去订阅商店购买该服务', '')
      },
      loadMore () {
        if (this.allPosts === 0) {
          let data = {
            bbs_id: this.bbsId,
            page: this.page_1,
            limit: this.limit
          }
          this.getForumPostList(data)
        } else {
          let data = {
            bbs_id: this.bbsId,
            page: this.page_2,
            limit: this.limit
          }
          this.getForumActList(data)
        }
      },
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'user_detail',
            options: { userId: userId }
          }))
        }
      },
      publishNormalPost (bbsId, channelId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'normal_post',
            options: { bbsId: bbsId, channelId: channelId }
          }))
        }
      }
    },
    watch: {
      summary () {
        Indicator.close()
      },
      loading () {
        if (this.loading) {
          this.loadMore()
        }
      },
      statePostList () {
        Indicator.close()
        if (this.statePostList.length !== 0) {
          this.page_1 += 1
          this.loading = false
          this.postList = this.postList.concat(this.statePostList)
        } else {
          this.allLoaded = true
        }
      },
      stateActList () {
        Indicator.close()
        if (this.stateActList.length !== 0) {
          this.page_2 += 1
          this.loading = false
          this.actList = this.actList.concat(this.stateActList)
        } else {
          this.allLoaded = true
        }
      }
      // 'listData': function (val) {
      //   if (val.result && val.result !== '') {
      //     this.list = val.result
      //   } else {

      //   }
      // },
      // 'activityList': function (val) {
      //   if (val.result && val.result !== '') {
      //     this.alist = val.result
      //   } else {

      //   }
      // },
      // 'summaryData': function (val) {
      //   if (val.result && val.result !== '') {
      //     if (val.result.canJoin === 0) { // 0不能进入 1能够进入
      //       this.getForumList(this.bbs_id)
      //       if (val.result.type === 2) {
      //         this.getActivityList(this.bbs_id)
      //       }
      //     } else {

      //     }

      //     if (this.activ) {  // 活动论坛 暂时写死
      //       this.summary = {
      //         avatar: '',
      //         canPostActive: 1,
      //         joinNumber: 123,
      //         postNumber: 456,
      //         managers: [
      //           {
      //             managerAvatar: ''
      //           }
      //         ]
      //       }
      //     } else {
      //       this.summary = val.result
      //     }
      //   } else {

      //   }
      // }
    }
  }
</script>

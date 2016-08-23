<style lang="less">
  @import "../../../styles/base/base-750";
  @import "./index.less";
</style>

<template>
  <ul class="forum_reply">
    <li v-for="key in replyLists" class="replsy">
      <div class="first_level_reply">
        <div class="head">
          <div class="avatar" @click="getUserInfo(key.userId)">
            <img :src="key.userAvatar">
          </div>
          <div class="name" @click="getUserInfo(key.userId)">
            {{ key.userName }}
          </div>
          <div @click="domore" class="moreaction">
            <i class="icon-down-open-c"></i>
          </div>
        </div>

        <div class="forum_reply_con" v-for="message in key.mediaList">
          <p v-if="message.mediaType === replyConfig.TEXT_REPLY">{{ message.mediaContent }}</p>
          <div v-if="message.mediaType === replyConfig.IMG_REPLY">
            <img :src="message.mediaContent" />
          </div>
        </div>

        <div class="reply_at_list" v-if="key.atedMembers">
          <p>
            提到了：
          </p>
          <div class="at_member">
            <atlist :list="key.atedMembers"></atlist>
          </div>
        </div>

        <div class="post_details">
          <span>第{{ $index + 2 }}楼</span>
          <span>{{ key.createdAt | dateFormat }}</span>
          <div class="reply_button" @click="ReplyComment(key.replyId, key.userId, key.userName)">
            <i class="icon-comment-c"></i>
          </div>
        </div>
      </div>

      <div v-if="key.secondReplys.length" class="second_reply_list">
        <div v-for="secondKey in key.secondReplys" class="list_wrap">
          <div class="list">
            <div class="list_main">
              <p class="name">
                {{ secondKey.fromUserName }}
                <span v-if="secondKey.toUserId">回复 {{ secondKey.toUserName }}</span>
                 :
              </p>
              <div class="right-section">
                <div class="say"
                v-for="message in secondKey.mediaList"
                @click="ReplyTwoComment(key.replyId, secondKey.fromUserId, secondKey.fromUserName, secondKey.replyId)">
                  <p v-if="message.mediaType === replyConfig.TEXT_REPLY">{{ message.mediaContent }}</p>
                  <div v-if="message.mediaType === replyConfig.IMG_REPLY">
                    <img :src="message.mediaContent" />
                  </div>
                </div>
                <div class="list_mention" v-if="secondKey.atedMembers">
                  <p>
                    提到了：
                  </p>
                  <div class="at_member">
                    <atlist :list="secondKey.atedMembers"></atlist>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="more_list" v-if="key.surplusSecondReplyNum">
          <a href="javascript:;" @click="moreReplys(postid, key.fristReplyId)">
            更多 {{key.surplusSecondReplyNum}} 条回复…
          </a>
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
  <mt-actionsheet :actions="myactions" :visible.sync="sheetVisible"></mt-actionsheet>
</template>

<script>
  import $ from 'npm-zepto'
  import Vue from 'vue'
  import atlist from '../at_list/index'
  import {
    getDetailReplys,
    getMoreReplys
  } from '../../../vuex/forums/actions'
  import { Spinner, Actionsheet } from 'mint-ui'
  import replyConfig from '../../../constants/replyType'

  Vue.component(Spinner.name, Spinner)
  Vue.component(Actionsheet.name, Actionsheet)

  export default {
    data () {
      return {
        myactions: [
          {
            name: this.detail.canDelete ? '删除' : '举报',
            method: (val) => { console.log(val) }
          },
          {
            name: '收藏',
            method: () => { console.log(1) }
          }
        ],
        sheetVisible: false,
        loading: false,
        allLoaded: false,
        myUserId: '',
        replyConfig: replyConfig,
        page: 1,
        limit: 10,
        replyLists: []
      }
    },
    props: {
      postid: {
        type: Number,
        require: true
      }
    },
    components: {
      atlist
    },
    ready () {
      this.myUserId = window.localStorage.getItem('userId')

      // 回复评论回调监听方法
      let replyPostListener = (data) => {
        // return window.alert(JSON.stringify(data))
      }
      if (!window.tinfiniteListener) {
        window.tinfiniteListener = {}
      }
      window.tinfiniteListener.replyPostListener = replyPostListener

      // 滚动事件
      $(window).scroll(() => {
        let sh = $(window).scrollTop()
        let wh = $(window).height()
        let dh = $(document).height()
        if (dh - sh - wh < 30) {
          this.loading = true
        }
      })
    },
    created () {
      this.loadMore()
    },
    vuex: {
      getters: {
        post_id: state => state.route.query.postId,
        replys: state => state.forums.replys,
        detail: state => state.forums.detail
      },
      actions: {
        getDetailReplys,
        getMoreReplys
      }
    },
    watch: {
      replys () {
        if (this.replys.length !== 0) {
          this.page += 1
          this.loading = false
          this.replyLists = this.replyLists.concat(this.replys)
        } else {
          this.allLoaded = true
        }
      },
      loading () {
        if (this.loading) {
          this.loadMore()
        }
      }
    },
    methods: {
      loadMore () {
        let data = {
          post_id: this.post_id,
          page: this.page,
          limit: this.limit,
          second_reply_num: 10
        }
        this.getDetailReplys(data)
      },
      moreReplys: function (postId, firstReplyId) {
        this.getMoreReplys({
          postId: postId,
          firstReplyId
        })
      },
      domore () {
        this.sheetVisible = !this.sheetVisible
      },
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage({
            pname: 'user_detail',
            options: { userId: userId }
          })
        }
      },
      ReplyComment (replyId, userId, userName) {
        let channelId = window.localStorage.getItem('channelId')
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage({
            pname: 'reply_post',
            options: {
              oneLevelId: replyId,  // 回复帖子时为0，回复评论时为当前评论的1级回复ID
              channelId: channelId,
              postId: this.post_id,
              toUserId: userId,
              toUserName: userName,
              pid: replyId // 回复帖子时为0，回复评论时为评论id
            }
          })
        }
      },
      ReplyTwoComment (replyId, userId, userName, pId) {
        let channelId = window.localStorage.getItem('channelId')
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage({
            pname: 'reply_post',
            options: {
              oneLevelId: replyId,  // 回复帖子时为0，回复评论时为当前评论的1级回复ID
              channelId: channelId,
              postId: this.post_id,
              toUserId: userId,
              toUserName: userName,
              pid: pId // 回复帖子时为0，回复评论时为评论id
            }
          })
        }
      },
      deleteReply () {
      }
    }
  }
</script>

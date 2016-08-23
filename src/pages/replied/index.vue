<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="page">
    <ul>
      <li v-for="item in repliedLists">
        <!-- 回复人头像姓名 -->
        <div class="header clearfix" @click="getUserInfo(item.userId)">
          <img :src="item.avatar" data-ignore="1" />
          <p class="name">{{ item.fullname }}</p>
        </div>
        <!-- 二级回复 -->
        <div v-if="item.firstReplyId" class="describe">
          <p v-for="reply in item.messageList" v-if="reply.mediaType === 1">
            回复
            <span class="name" @click="getUserInfo(item.toUserId)">
            {{ item.toUserFullname }}</span>：
            {{ reply.mediaContent }}
          </p>
          <!-- 以后加入语音功能 -->
          <div>
            <img v-for="reply in item.messageList" v-if="reply.mediaType === 2" class="reply_img" :src="reply.mediaContent" />
          </div>
        </div>
        <!-- 一级回复 -->
        <div v-else class="describe">
          <p v-for="reply in item.messageList" v-if="reply.mediaType === 1">{{ reply.mediaContent }}</p>
          <!-- 以后加入语音功能 -->
          <div>
            <img v-for="reply in item.messageList" v-if="reply.mediaType === 2" class="reply_img" :src="reply.mediaContent" />
          </div>
        </div>
        <!-- @ -->
        <div class="at_me_con" :class="{'active' : item.firstReplyId}" v-if="item.atReply.length">
          <p class="tip">提到了：</p>
          <div class="at_me">
            <div v-for="user in item.atReply">
              <a href="javascript:;" @click="getUserInfo(user.userId)">{{ user.fullname }}</a>
              <span v-if="item.atReply.length !== ($index + 1)">，</span>
            </div>
          </div>
        </div>
        <!-- 帖子信息和一级回复 -->
        <div :class="{'details_con' : item.firstReplyId }" >
          <div v-if="item.firstReplyId" class="reply">
            <span class="name" @click="getUserInfo(user.parentFromUserId)">{{ item.parentFromFullname }}</span>：
            <p v-for="myReply in item.parentMessageList" v-if="myReply.mediaType === 1">{{ myReply.mediaContent }}</p>
            <!-- 以后加入语音功能 -->
            <div>
              <img v-for="myReply in item.parentMessageList" v-if="myReply.mediaType === 2" class="reply_img" :src="myReply.mediaContent" />
            </div>
          </div>
          <!-- 二级@ -->
          <div v-if="item.firstReplyId && item.parentAtReply.length" class="at_me_con">
            <p class="tip">提到了：</p>
            <div class="at_me">
              <div v-for="user in item.parentAtReply">
                <a href="javascript:;" @click="getUserInfo(user.userId)">{{ user.fullname }}</a>
                <span v-if="item.parentAtReply.length !== ($index + 1)">，</span>
              </div>
            </div>
          </div>
          <post
            :id="item.postId"
            :img="item.postImage || item.postCreaterAvatar"
            :name="item.postCreaterName || ''"
            :title="item.postTitle"></post>
        </div>
        <div class="foot clearfix">
          <span class="time">{{ item.replyedAt | dateFormat }}</span>
          <span class="title">{{ item.bbsName }}</span>
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
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator, Toast } from 'mint-ui'
  import post from '../../components/modules/post'
  import store from '../../vuex/store'
  import { getRepliedList } from '../../vuex/reply/actions'
  import $ from 'npm-zepto'

  Vue.component(Spinner.name, Spinner)

  export default {
    store,
    data () {
      return {
        loading: false,
        allLoaded: false,
        repliedLists: [],
        page: 1,
        limit: 10,
        loadSuccess: false
      }
    },
    components: {
      post
    },
    vuex: {
      getters: {
        lists: ({ reply }) => reply.repliedLists
      },
      actions: {
        getRepliedList
      }
    },
    watch: {
      lists () {
        if (this.lists.length !== 0) {
          this.page += 1
          this.loading = false
          this.repliedLists = this.repliedLists.concat(this.lists)
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
    created () {
      Indicator.open('加载中...')
      this.loadMore()
    },
    ready () {
      $(window).scroll(() => {
        let sh = $(window).scrollTop()
        let wh = $(window).height()
        let dh = $(document).height()
        if (dh - sh - wh < 30) {
          this.loading = true
        }
      })
    },
    methods: {
      getUserInfo (userId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'user_detail',
            options: { userId: userId }
          }))
        }
      },
      loadMore () {
        let data = {
          page: this.page,
          limit: this.limit
        }
        this.getRepliedList(data, this.success, this.fail)
      },
      success () {
        this.loadSuccess = true
        Indicator.close()
      },
      fail () {
        Indicator.close()
        Toast('网络出错啦...')
      }
    }
  }
</script>

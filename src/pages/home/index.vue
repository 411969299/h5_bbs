<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="page">
    <div class="header">
      <a class="at_me" v-link="{ path: 'at_me' }">
        <i class="icon-at-c"></i>
        <p>@我的</p>
        <b v-show="atMeNum">&nbsp;{{ atMeNum }}&nbsp;</b>
        <span></span>
      </a><a class="reply" v-link="{ path: 'reply' }">
        <i class="icon-comment-c"></i>
        <p>回复</p>
        <b v-show="replyMeNum">&nbsp;{{ replyMeNum }}&nbsp;</b>
        <span></span>
      </a><a class="likes" v-link="{ path: 'favor' }">
        <i class="icon-thumbs-c"></i>
        <p>点赞</p>
        <b v-show="likeMeNum">&nbsp;{{ likeMeNum }}&nbsp;</b>
        <span></span>
      </a><a class="post" v-link="{ path: 'my_post' }">
        <i class="icon-my-shape-c"></i>
        <p>我的贴</p>
      </a>
    </div>
    <div class="interval"></div>
    <div class="activity" v-for="key in activityLists">
      <a class="apply"
      href="javascript:;"
      @click="activePost(key.bbsId, key.channelId)">
        <div class="icon_con">
          <i class="icon-ok-c"></i>
        </div>
        <p>活动申请</p>
        <span></span>
      </a><a class="forum"
      v-link="{
        path: '/forum_list?bbsId='+ key.bbsId +'&channelId=' + key.channelId
      }">
        <div class="icon_con icon-quatrefoil-c"></div>
        <p>活动论坛</p>
      </a>
    </div>
    <div class="interval"></div>
    <div class="forum_list">
      <p class="title">论坛列表</p>
      <div class="list">
        <ul class="list_con">
          <li
          v-if="item.userCanEnter"
          :class="{
            'clock': item.bbsType === bbsConfig.TASK_BBS,
            'join': item.userCanEnter
          }"
          v-for="item in forumLists"
          v-link="{
            path: '/forum_list?bbsId='+ item.bbsId +'&channelId=' + item.channelId
          }">
            <img :src="item.bbsAvatar" data-ignore="1" />
            <p><span class="lable">打卡</span>{{ item.bbsName }}</p>
            <i class="icon tip"></i>
          </li>
          <li
            v-if="!item.userCanEnter"
            :class="{
              'clock': item.bbsType === bbsConfig.TASK_BBS,
              'join': item.userCanEnter
            }"
            v-for="item in forumLists"
            v-link="{ path: '/forum_summary?bbsId='+ item.bbsId +'&channelId=' + item.channelId
            }">
              <img :src="item.bbsAvatar" data-ignore="1" />
              <p><span class="lable">打卡</span>{{ item.bbsName }}</p>
              <i class="icon tip"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator, Toast } from 'mint-ui'
  import store from '../../vuex/store'
  import { getHomeList, getUserDetail } from '../../vuex/home/actions'
  import bbsConfig from '../../constants/bbsType'

  Vue.component(Spinner.name, Spinner)

  export default {
    store,
    data () {
      return {
        forumLists: [],
        atMeNum: 0,
        replyMeNum: 0,
        likeMeNum: 0,
        bbsConfig: bbsConfig,
        loadSuccess: false
      }
    },
    vuex: {
      getters: {
        lists: ({ home }) => home.lists,
        activityLists: ({ home }) => home.activityLists,
        atNum: ({ home }) => home.atNum,
        replyNum: ({ home }) => home.replyNum,
        likeNum: ({ home }) => home.likeNum,
        userInfo: ({ home }) => home.userInfo
      },
      actions: {
        getHomeList,
        getUserDetail
      }
    },
    watch: {
      lists () {
        this.forumLists = this.forumLists.concat(this.lists)
      },
      userInfo () {
        const USER_ID = 'userId'
        const USER_NAME = 'userName'
        window.localStorage.setItem(USER_ID, this.userInfo.id)
        window.localStorage.setItem(USER_NAME, this.userInfo.fullname)
      },
      atNum () {
        const AT_NUM = 'atNum'
        window.localStorage.setItem(AT_NUM, this.atNum)
        this.atMeNum = window.localStorage.getItem('atNum')
      },
      replyNum () {
        const REPLY_NUM = 'replyNum'
        window.localStorage.setItem(REPLY_NUM, this.replyNum)
        this.replyMeNum = window.localStorage.getItem('replyNum')
      },
      likeNum () {
        const LIKE_NUM = 'likeNum'
        window.localStorage.setItem(LIKE_NUM, this.likeNum)
        this.likeMeNum = window.localStorage.getItem('likeNum')
      }
    },
    created () {
      Indicator.open('加载中...')
      this.getHomeList(this.success, this.fail)
      this.getUserDetail()
      this.atMeNum = window.localStorage.getItem('atNum')
      this.replyMeNum = window.localStorage.getItem('replyNum')
      this.likeMeNum = window.localStorage.getItem('likeNum')
    },
    ready () {
    },
    methods: {
      activePost (bbsId, channelId) {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage(JSON.stringify({
            pname: 'activity_post',
            options: {
              bbsId: bbsId,
              channelId: channelId
            }
          }))
        }
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

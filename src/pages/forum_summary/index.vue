<style lang="less">
  @import "../../styles/base/base-750";
  @import "./index";
</style>

<template>
  <div class="forum_head">
    <div class="img">
      <img :src="summary.bbsAvatar">
    </div>
    <div class="det">
      <div class="title">{{ summary.bbsName }}</div>
      <p v-if="summary.bbsType === 1">普通</p>
      <p v-if="summary.bbsType === 2">打卡</p>
      <p v-if="summary.bbsType === 3">学习</p>
      <ul>
        <li>人数 {{ summary.bbsMemberNum }}</li>
        <li>帖子 {{ summary.bbsPostNum }}</li>
      </ul>
    </div>
    <div class="clear"></div>
  </div>

  <div class="forum_body">
      <div class="title">本论坛简介</div>
      <div class="con">{{ summary.bbsIntroduction }}</div>
  </div>

  <div class="forum_bzmsg">
    <div class="title">版主信息</div>
    <div class="msg">
      <div v-for="key in summary.bbsManagers" class="content" @click="getUserInfo(key.userId)">
        <div class="img">
          <img :src="key.avatar" data-ignore="1" />
        </div>
        <div class="name">{{key.userName}}</div>
      </div>
    </div>
  </div>

  <div @click="msgalert" class="forum_action">进入论坛</div>
</template>

<script>
  import { getForumSummary } from '../../vuex/forums/actions'
  import { MessageBox } from 'mint-ui'

  export default {
    data () {
      return {
      }
    },

    vuex: {
      getters: {
        bbsId: state => state.route.query.bbsId,
        channelId: state => state.route.query.channelId,
        summary: state => state.forums.summary
      },
      actions: {
        getForumSummary
      }
    },

    created () {
      let bbsId = this.bbsId
      let channelId = this.channelId

      if (bbsId && channelId) {
        this.getForumSummary(bbsId, channelId)
      } else {
        // 报错
      }
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
      msgalert () {
        if (this.summary.canJoin === 1) {
          this.$router.go({
            name: 'forumlist',
            query: {
              bbsId: this.bbsId,
              channelId: this.channelId
            }
          })
        } else {
          MessageBox.alert('请去订阅商店购买该服务', '')
        }
      }
    }
  }
</script>
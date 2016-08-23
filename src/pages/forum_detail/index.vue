<style lang="less">
  @import "../../styles/base/base-750";
  @import './index';
</style>
<template>
<div class="forum_deteil">
  <div class="forum_head">

    <div class="det">
      <div class="title">{{ detail.title }}</div>
      <div class="zp">
        <i class="icon-thumbs-c">
          <span>{{ likeNum }}</span>
        </i>
        <i class="icon-comment-c">
          <span>{{ detail.replyNum }}</span>
        </i>
      </div>
    </div>

  </div>
  <div class="forum_body">

    <div class="head">
      <div class="img" @click="getUserInfo(detail.userId)">
        <img :src="detail.userAvatar" data-ignore="1" >
      </div>
      <div class="name" @click="getUserInfo(detail.userId)">
        {{ detail.userName }}
      </div>
      <div class="author">
        <span class="tag tag-blue">楼主</span>
      </div>
      <div v-if="detail.canDelete" @click="domore" class="moreaction">
        <i class="icon-down-open-c"></i>
      </div>
    </div>

    <div class="con">
      <div class="media_wrap">
        <div class="media_audio" v-if="detail.audioContents" v-for="audio in detail.audioContents">
          <myaudio :src="audio.mediaContent"></myaudio>
        </div>
        <div class="media_text" v-if="detail.content">
          <p>{{ detail.content }}</p>
        </div>
        <div class="media_image" v-if="detail.imageContents">
          <img v-for="item in detail.imageContents" :src="item.mediaContent" alt="" data-ignore="1" :height="initImgHeight(item.mediaWidth, item.mediaHeight)" />
        </div>
      </div>
      <!-- <p>{{detail.contents}}</p> -->
    </div>

    <vote></vote>
    <apply></apply>

    <div class="post_details">
      <span class="floor_number">第1楼</span>
      <span class="time">{{ detail.createdAt | dateFormat }}</span>
    </div>

    <div class="like_member" v-if="detail.likeMembers">
      <div class="like_members_wrap">
        <atlist :list="detail.likeMembers"></atlist>
      </div>
      <span class="like_total">
        等{{ detail.likeNumber }}赞过
      </span>
    </div>
  </div>

  <reply :postid='parseInt(postId)'></reply>

</div>
<div class="deteil_action">
  <div class="re" @click="ReplyPost">
    <span class="zp">
      <i class="icon-comment-c">
        <span>回复</span>
      </i>
    </span>
  </div>
  <i class="center_border"></i>
  <div class="dz" @click="postLike">
    <span class="zp">
      <i class="icon-thumbs-c" v-bind:class="{ 'like_or_not': likeOrNot }">
        <span><b v-if="likeOrNot">已</b><b v-else>点</b>赞</span>
      </i>
    </span>
  </div>
</div>
<mt-actionsheet :actions="myactions" :visible.sync="sheetVisible"></mt-actionsheet>
</template>

<script>
// import $ from 'npm-zepto'
import Vue from 'vue'
import reply from '../../components/modules/post_reply/index'
import atlist from '../../components/modules/at_list/index'
import myaudio from '../../components/modules/audio_plug/audio'
import vote from '../../components/modules/post_detail_vote/index'
import apply from '../../components/modules/post_detail_apply/index'
import { getForumDetail, likeOrCancel } from '../../vuex/forums/actions'
import { deletePost } from '../../vuex/post/actions'
import { Actionsheet, Indicator, Toast } from 'mint-ui'
Vue.component(Actionsheet.name, Actionsheet)

export default {
  data () {
    return {
      sheetVisible: false,
      likeOrNot: false,
      myactions: [
        {
          name: '删除',
          method: this.delete
        }
      ],
      likeNum: 0
    }
  },
  created () {
    Indicator.open('加载中...')
    this.showButton()
    let data = {
      post_id: this.postId
    }
    this.getForumDetail(data)
  },
  ready () {
    this.likeOrNot = this.detail.likeOrNot
    // 回复楼主回调监听方法
    let replyPostListener = (data) => {
      // return window.alert(JSON.stringify(data))
    }
    if (!window.tinfiniteListener) {
      window.tinfiniteListener = {}
    }
    window.tinfiniteListener.replyPostListener = replyPostListener
  },
  components: {
    reply,
    atlist,
    myaudio,
    vote,
    apply
  },
  vuex: {
    getters: {
      postId: state => state.route.query.postId,
      detail: state => state.forums.detail,
      isLike: state => state.forums.detail.likeOrNot,
      deleteStatus: ({ post }) => post.deleteStatus
    },
    actions: {
      getForumDetail,
      likeOrCancel,
      deletePost
    }
  },
  watch: {
    detail () {
      Indicator.close()
      this.likeNum = this.detail.likeNum
    },
    isLike (val) {
      this.likeOrNot = val === 1 ? 1 : 0
    }
  },
  methods: {
    ReplyPost () {
      let bridge = window.tinfiniteBridge
      if (bridge && bridge.jumptoNativePage) {
        bridge.jumptoNativePage(JSON.stringify({
          pname: 'reply_post',
          options: {
            oneLevelId: 0,  // 回复帖子时为0，回复评论时为当前评论的1级回复ID
            channelId: this.detail.channelId,
            postId: this.postId,
            toUserId: this.detail.userId,
            toUserName: '楼主',
            pid: 0 // 回复帖子时为0，回复评论时为评论id
          }
        }))
      }
    },
    // 显示分享按钮
    showButton () {
      let bridge = window.tinfiniteBridge
      if (bridge && bridge.showButton) {
        bridge.showButton("[{ type: 1, value: '', callback: '' }]")
      }
    },
    postLike () {
      if (this.likeOrNot) {
        this.likeNum -= 1
      } else {
        this.likeNum += 1
      }
      let data = {
        post_id: parseInt(this.postId),
        like_type: this.likeOrNot === 1 ? 2 : 1  // 1点赞2取消
      }
      this.likeOrCancel(data)
    },
    domore () {
      this.sheetVisible = !this.sheetVisible
    },
    switchCheck (num) {
      this.checkedNum = num
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
    delete () {
      let data = {
        post_id: this.postId
      }
      this.deletePost(data, this.deleteSuccess, this.deleteFail)
    },
    deleteSuccess () {
      Toast('删除成功')
      this.router.go({path: '/'})
    },
    deleteFail () {
      Toast('删除失败')
    },
    // 计算初始化图片高
    initImgHeight (width, height) {
      let clientW = document.documentElement.clientWidth || document.body.clientWidth // 屏幕宽度
      let marginW = 60 * (clientW / 750)    // 图片margin所占空间
      return (clientW - marginW) * (height / width)
    }
  }
}
</script>

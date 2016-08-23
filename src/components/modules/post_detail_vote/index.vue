<style lang="less">
  @import "../../../styles/base/base-750";
  @import './index';
</style>

<template>
  <div v-if="detail.type === CONFIG.postType.punch && !detail.canVote" class="vote_wrap">
    <div class="vote_record_wrap">
      <div class="rate_wrap">
        <div class="vote_rate vote_like" :style="{ flex: detail.agreeNum }"></div>
        <div class="vote_rate vote_dislike" :style="{ flex: detail.disAgreeNum }"></div>
      </div>
      <div class="data_wrap">
        <span class="text">完成</span>
        <span>{{ detail.agreeNum || 0 }}</span>
      </div>
    </div>
    <div class="vote_record_wrap">
      <div class="rate_wrap">
        <div class="vote_rate vote_like" :style="{ flex: detail.disAgreeNum }"></div>
        <div class="vote_rate vote_dislike" :style="{ flex: detail.agreeNum }"></div>
      </div>
      <div class="data_wrap">
        <span class="text">未完成</span>
        <span>{{ detail.disAgreeNum || 0 }}</span>
      </div>
    </div>
    <div class="voted_member" v-if="detail.voteMembers">
      <div class="avatar_wrap" v-if="detail.voteMembers.length > 7">
        <ul>
          <li v-for="n in 7" @click="getUserInfo(detail.voteMembers[n].userId)">
            <img :src="detail.voteMembers[n].avatar" data-ignore="1" />
          </li>
        </ul>
        <span v-link="{ path: 'voter?postId=' + postId }">···</span>
      </div>
      <div class="avatar_wrap" v-else>
        <ul>
          <li v-for="item in detail.voteMembers" @click="getUserInfo(item.userId)">
            <img :src="item.avatar" data-ignore="1" />
          </li>
        </ul>
      </div>
      <span class="text_wrap">
        已投票
      </span>
    </div>
  </div>

  <div v-if="detail.type === CONFIG.postType.punch && detail.canVote" class="check_wrap">
    <div
      class="check_list"
      :class="{ 'checked': checkedNum === 1 }"
      @click="switchCheck(1)">
      <span class="check_text">完成</span>
      <span class="check_icon">
        <i class="icon-ok-c"></i>
      </span>
    </div>
    <div
      class="check_list"
      :class="{ 'checked': checkedNum === 0 }"
      @click="switchCheck(0)">
      <span class="check_text">未完成</span>
      <span class="check_icon">
        <i class="icon-ok-c"></i>
      </span>
    </div>
    <div class="submit_btn" @click="voteSubmit">
      提交
    </div>
  </div>
</template>

<script>
import { vote } from '../../../vuex/forums/actions'
import postConfig from '../../../constants/postType'

export default {
  data () {
    return {
      checkedNum: 1,
      CONFIG: postConfig
    }
  },
  computed: {},
  ready () {},
  attached () {},
  methods: {
    switchCheck (num) {
      this.checkedNum = num
    },
    voteSubmit () {
      this.vote({
        is_agree: this.checkedNum,
        post_id: this.postId
      })
    }
  },
  components: {},
  watch: {},
  vuex: {
    getters: {
      detail: state => state.forums.detail,
      postId: state => state.route.query.postId
    },
    actions: {
      vote
    }
  }
}
</script>

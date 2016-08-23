<style lang="less">
  @import "../../../styles/base/base-750";
  @import './index';
</style>

<template>
  <div v-if="detail.type === CONFIG.postType.activity" class="activity">
    <div class="activity_details">
      <p class="">
        报名时间：{{ detail.applyBeginAt | timeFormat }} 至 {{ detail.applyEndAt | timeFormat }}。
      </p>
      <p class="">
        活动时间：{{ detail.activityBeginAt | timeFormat }} 至 {{ detail.activityEndAt | timeFormat }}。
      </p>
      <p class="">
        {{ detail.goal }}
      </p>
    </div>
    <div class="haspeople" v-if="detail.joinMembers">
      <div class="join_member_total">
        已有<span>{{ detail.joinMembers.total }}</span>人参与活动
      </div>
      <ul class="join_member_list">
        <li
          v-for="member in detail.joinMembers.userInfoList"
          class="join_member"
          @click="getUserInfo(member.userId)">
          <img :src="member.avatar" data-ignore="1" />
        </li>
      </ul>
    </div>
    <div v-if="detail.canJoin" class="join_btn can_join" @click="clickPay()">
      支付{{ detail.fee }}元参与该活动
    </div>
    <div v-else class="join_btn can_not_join">
      已参与
    </div>
    <div class="mention" v-if="detail.atedMembers">
      <div class="mention_text">
        <p>提到了:</p>
      </div>
      <div class="mention_list">
        <img
          v-for="key in detail.atedMembers"
          :src="key.avatar"
          data-ignore="1"
          @click="getUserInfo(key.userId)">
      </div>
    </div>
  </div>
</template>

<script>
import { payToJoin } from '../../../vuex/forums/actions'
import postConfig from '../../../constants/postType'

export default {
  data () {
    return {
      CONFIG: postConfig
    }
  },
  computed: {},
  ready () {},
  attached () {},
  methods: {
    clickPay () {
      this.payToJoin()
    },
    getUserInfo (userId) {
      let bridge = window.tinfiniteBridge
      if (bridge && bridge.jumptoNativePage) {
        bridge.jumptoNativePage(JSON.stringify({
          pname: 'user_detail',
          options: { userId: userId }
        }))
      }
    }
  },
  components: {},
  vuex: {
    getters: {
      detail: state => state.forums.detail
    },
    actions: {
      payToJoin
    }
  }
}
</script>

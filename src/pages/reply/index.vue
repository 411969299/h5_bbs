<style lang="less">
  @import './index.less';
</style>

<template>
  <div class="page">
    <mt-cell
    title="回复我的"
    v-link="{ path: 'reply_me' }"
    is-link>
      <mt-badge v-if="replyNum" size="small" color="#F43530" type="primary">{{ replyNum }}</mt-badge>
    </mt-cell>
    <mt-cell
    title="我回复的"
    v-link="{ path: '/replied' }"
    is-link>
    </mt-cell>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Cell, Badge } from 'mint-ui'

  Vue.component(Cell.name, Cell)
  Vue.component(Badge.name, Badge)

  export default {
    data () {
      return {
        replyNum: 0
      }
    },
    created () {
      this.replyNum = window.localStorage.getItem('replyNum')
    }
  }
</script>
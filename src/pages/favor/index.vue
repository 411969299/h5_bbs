<style lang="less">
  @import './index.less';
</style>

<template>
  <div class="page">
    <mt-cell
    title="赞了我的"
    href="/favor_me"
    is-link>
      <mt-badge v-if="favorNum" size="small" color="#F43530" type="primary">{{ favorNum }}</mt-badge>
    </mt-cell>
    <mt-cell
    title="我赞过的"
    href="/favored"
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
        favorNum: 0
      }
    },
    created () {
      this.favorNum = window.localStorage.getItem('likeNum')
    }
  }
</script>
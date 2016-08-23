<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="page">
    <div class="my_clock">
      <div class="clock_con clearfix">
        <span class="ranking_index"></span>
        <img :src="myClockInfo.avatar" data-ignore="1" />
        <div>
          <p>{{ myClockInfo.fullname }}</p>
          <span>第{{ myClockInfo.rank }}名</span>
        </div>
        <span class="clock">已打卡{{ myClockInfo.clockNumber }}天</span>
      </div>
    </div>
    <div>
      <ul class="ranking_con">
        <li class="ranking_list"
        v-for="item in clockLists"
        v-link="{ path: 'clock_record?bbsId=' + bbsId + '&userId=' + item.userId + '&isMy=1&channelId=' + channelId + '&userName=' + item.fullname }">
          <span class="ranking_index">{{ $index+1 }}</span>
          <img :src="item.avatar" data-ignore="1" />
          <p @click="getUserInfo(item.userId)">{{ item.fullname }}</p>
          <span class="clock"
          :class="{'active' : $index === 0 || $index === 1 || $index === 2 }">
            已打卡{{ item.clockNumber }}天</span>
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
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator, Toast } from 'mint-ui'
  import store from '../../vuex/store'
  import { getClockList } from '../../vuex/clock/actions'
  import $ from 'npm-zepto'

  Vue.component(Spinner.name, Spinner)

  export default {
    store,
    data () {
      return {
        loading: false,
        allLoaded: false,
        clockLists: [],
        page: 1,
        limit: 10,
        loadSuccess: false
      }
    },
    vuex: {
      getters: {
        bbsId: state => state.route.query.bbsId,
        channelId: state => state.route.query.channelId,
        lists: ({ clock }) => clock.clockLists,
        myClockInfo: ({ clock }) => clock.myClockInfo
      },
      actions: {
        getClockList
      }
    },
    watch: {
      lists () {
        if (this.lists.length !== 0) {
          this.page += 1
          this.loading = false
          this.clockLists = this.clockLists.concat(this.lists)
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
        if (bridge && bridge.getPostUserId) {
          bridge.getPostUserId(userId)
        }
      },
      loadMore () {
        let data = {
          bbs_id: this.bbsId,
          page: this.page,
          limit: this.limit
        }
        this.getClockList(data, this.success, this.fail)
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
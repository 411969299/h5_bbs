<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="page">
    <ul class="post_list">
      <li v-for="item in favoredLists">
        <div class="portrait" @click="getUserInfo(item.postCreaterId)">
          <img :src="item.postCreaterAvatar" data-ignore="1" />
        </div>
        <div class="con">
          <div class="clearfix" v-link="{path: '/forum_detail?postId=' + item.postId}">
            <img v-show="item.postImage" class="cover" :src="item.postImage" data-ignore="1" />
            <div class="post_info">
              <h6>{{ item.postCreaterName }}</h6>
              <p v-if="item.postType === 2"><i class="lable">打卡</i>&nbsp;{{ item.postTitle }}<span>({{ item.finishDays }}/{{ item.goalDays }})</span></p>
              <p v-else>{{ item.postTitle }}</p>
            </div>
          </div>
          <div class="post_foot clearfix">
            <span class="time">{{ item.likeAt | dateFormat }}</span>
            <span class="title">{{ item.bbsName }}</span>
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator, Toast } from 'mint-ui'
  import store from '../../vuex/store'
  import { getFavoredList } from '../../vuex/favor/actions'
  import $ from 'npm-zepto'

  Vue.component(Spinner.name, Spinner)

  export default {
    store,
    data () {
      return {
        loading: false,
        allLoaded: false,
        favoredLists: [],
        page: 1,
        limit: 10,
        loadSuccess: false
      }
    },
    vuex: {
      getters: {
        lists: ({ favor }) => favor.favoredLists
      },
      actions: {
        getFavoredList
      }
    },
    watch: {
      lists () {
        if (this.lists.length !== 0) {
          this.page += 1
          this.loading = false
          this.favoredLists = this.favoredLists.concat(this.lists)
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
        this.getFavoredList(data, this.success, this.fail)
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

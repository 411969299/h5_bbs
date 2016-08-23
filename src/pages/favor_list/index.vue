<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="page">
    <ul class="favor_con">
      <li class="favor_list" v-for="item in favorLists">
        <img :src="item.avatar" />
        <p>{{ item.fullname }}</p>
        <span>{{ item.createdAt | dateFormat }}</span>
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
  import { getFavorList } from '../../vuex/favor/actions'
  import $ from 'npm-zepto'

  Vue.component(Spinner.name, Spinner)

  export default {
    store,
    data () {
      return {
        loading: false,
        allLoaded: false,
        favorLists: [],
        page: 1,
        limit: 10,
        loadSuccess: false
      }
    },
    vuex: {
      getters: {
        postId: state => state.route.query.postId,
        lists: ({ favor }) => favor.favorLists
      },
      actions: {
        getFavorList
      }
    },
    watch: {
      lists () {
        if (this.lists.length !== 0) {
          this.page += 1
          this.loading = false
          this.favorLists = this.favorLists.concat(this.lists)
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
      loadMore () {
        let data = {
          post_id: this.postId,
          page: this.page,
          limit: this.limit
        }
        this.getFavorList(data, this.success, this.fail)
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
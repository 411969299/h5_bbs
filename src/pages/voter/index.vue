<style lang="less">
  @import './index.less';
</style>

<template>
  <div class="page" >
    <div class="join_vote">
      已有<span>{{ tatal }}</span>人参与投票
    </div>
    <div>
      <ul class="favor_con">
        <li class="favor_list" v-for="item in voterLists">
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Indicator } from 'mint-ui'
  import store from '../../vuex/store'
  import { getVoterList } from '../../vuex/voter/actions'
  import $ from 'npm-zepto'

  Vue.component(Spinner.name, Spinner)

  export default {
    store,
    data () {
      return {
        loading: false,
        allLoaded: false,
        voterLists: [],
        page: 1,
        limit: 10
      }
    },
    vuex: {
      getters: {
        postId: state => state.route.query.postId,
        lists: ({ voter }) => voter.voterLists,
        tatal: ({ voter }) => voter.tatal
      },
      actions: {
        getVoterList
      }
    },
    watch: {
      lists () {
        Indicator.close()
        if (this.lists.length !== 0) {
          this.page += 1
          this.loading = false
          this.voterLists = this.voterLists.concat(this.lists)
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
      let data = {
        post_id: this.postId,
        page: this.page,
        limit: this.limit
      }
      this.getVoterList(data)
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
        this.getVoterList(data)
      }
    }
  }
</script>
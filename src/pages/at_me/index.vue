<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="page">
    <ul>
      <li v-for="item in atMeObj">
        <div class="header clearfix" @click="getUserInfo(item.fromUserId)">
          <img :src="item.fromUserAvatar" data-ignore="1" />
          <p class="name">{{ item.fromUserName }}</p>
        </div>
        <p class="describe">{{ item.content }}</p>
        <div class="at_me_con">
          <p class="tip">提到了：</p>
          <div class="at_me">
            <div v-for="user in item.atUser">
              <a href="javascript:;" @click="getUserInfo(user.atUserId)">{{ user.atFullname }}</a>
              <span v-if="item.atUser.length !== ($index + 1)">，</span>
            </div>
          </div>
        </div>
        <post
          :id="item.postId"
          :img="item.postImage || item.postCreaterAvatar"
          :name="item.postCreaterName"
          :title="item.postTitle"></post>
        <div class="foot clearfix">
          <span class="time">{{ item.createdAt | dateFormat }}</span>
          <span class="title">{{ item.bbsName }}</span>
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
  import post from '../../components/modules/post'
  import store from '../../vuex/store'
  import { getAtMeList } from '../../vuex/atMe/actions'
  import $ from 'npm-zepto'

  Vue.component(Spinner.name, Spinner)

  export default {
    store,
    data () {
      return {
        loading: false,
        allLoaded: false,
        atMeObj: [],
        page: 1,
        limit: 10,
        loadSuccess: false
      }
    },
    components: {
      post
    },
    vuex: {
      getters: {
        lists: ({ atMe }) => atMe.lists
      },
      actions: {
        getAtMeList
      }
    },
    watch: {
      lists () {
        if (this.lists.length !== 0) {
          this.page += 1
          this.loading = false
          this.atMeObj = this.atMeObj.concat(this.lists)
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
          bridge.jumptoNativePage({
            pname: 'user_detail',
            options: { userId: userId }
          })
        }
      },
      loadMore () {
        let data = {
          page: this.page,
          limit: this.limit
        }
        this.getAtMeList(data, this.success, this.fail)
      },
      success () {
        this.loadSuccess = true
        window.localStorage.removeItem('atNum')
        Indicator.close()
      },
      fail () {
        Indicator.close()
        Toast('网络出错啦...')
      }
    }
  }
</script>

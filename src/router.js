import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
var router = new VueRouter({
  history: true,
  linkActiveClass: 'active',
  saveScrollPosition: true,
  suppressTransitionError: true
})

router.afterEach(function (transition) {
  let bridge = window.tinfiniteBridge
  if (bridge && bridge.showButton) {
    bridge.showButton('[]')
  }
  // let t = transition.to.title
  // let p = t.match(/[^\/].*/)[0]
  // let index = p.indexOf('?')
  // if (index !== -1) {
    // p = p.slice(0, index)
  // }
  // document.title = p
})

router.map({
  '/': {
    component: (resolve) => {
      require(['./pages/home/'], resolve)
    }
  },
  '/clock_rank': {
    component: (resolve) => {
      require(['./pages/clock_rank/'], resolve)
    }
  },
  '/at_me': {
    component: (resolve) => {
      require(['./pages/at_me/'], resolve)
    }
  },
  '/reply': {
    component: (resolve) => {
      require(['./pages/reply/'], resolve)
    }
  },
  '/reply_me': {
    component: (resolve) => {
      require(['./pages/reply_me/'], resolve)
    }
  },
  '/replied': {
    component: (resolve) => {
      require(['./pages/replied/'], resolve)
    }
  },
  '/favor': {
    component: (resolve) => {
      require(['./pages/favor/'], resolve)
    }
  },
  '/favor_list': {
    component: (resolve) => {
      require(['./pages/favor_list/'], resolve)
    }
  },
  '/favor_me': {
    component: (resolve) => {
      require(['./pages/favor_me/'], resolve)
    }
  },
  '/favored': {
    component: (resolve) => {
      require(['./pages/favored/'], resolve)
    }
  },
  '/my_post': {
    component: (resolve) => {
      require(['./pages/my_post/'], resolve)
    }
  },
  '/clock_record': {
    component: (resolve) => {
      require(['./pages/clock_record/'], resolve)
    }
  },
  '/voter': {
    component: (resolve) => {
      require(['./pages/voter/'], resolve)
    }
  },
  '/test': {
    component: (resolve) => {
      require(['./pages/test/'], resolve)
    }
  },
  '/forum_detail': {
    title: '论坛详情',
    name: 'forumdetail',
    component: (resolve) => {
      require(['./pages/forum_detail/'], resolve)
    }
  },
  '/forum_list': {  // 列表
    title: '论坛列表',
    name: 'forumlist',
    component: (resolve) => {
      require(['./pages/forum_list/'], resolve)
    }
  },
  '/forum_summary': {  // 简介
    title: '论坛简介',
    name: 'forumsummary',
    component: (resolve) => {
      require(['./pages/forum_summary/'], resolve)
    }
  }
})

export default router

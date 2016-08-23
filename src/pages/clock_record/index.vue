<style lang="less">
  @import './index.less';
</style>

<template>
  <div v-if="loadSuccess" class="page">
    <div class="header">
      <div class="sign_info clearfix">
      <p class="clock">
        今日<span v-if="todayStatus">已</span><span v-if="!todayStatus">未</span>打卡</p>
        <!-- <p class="ranking">第{{ rank }}名</p> -->
        <p class="ranking" v-link="{path: 'clock_rank?bbsId=' + bbsId + '&channelId=' + channelId }">排行榜</p>
      </div>
      <div class="clock_page">
        <div class="circle" id="circles">
          <div class="stars"></div>
          <svg viewBox="0 0 100 100">
            <path
              d="M 50,50 m 0,-49 a 49,49 0 1 1 0,98 a 49,49 0 1 1 0,-98"
              stroke="#fff"
              stroke-opacity="0.6"
              stroke-width="2"
              fill-opacity="0">
            </path>
            <path
              d="M 50,50 m 0,-49 a 49,49 0 1 1 0,98 a 49,49 0 1 1 0,-98"
              stroke="#fff"
              stroke-width="2"
              fill-opacity="0"
              style="stroke-dasharray: 307.919, 307.919; stroke-dashoffset: 307.919px;">
            </path>
          </svg>
        </div>
        <div class="con">
          <p>已打卡<span>{{ finishDay }}</span>天</p>
        </div>
        <p class="target">目标{{ goalDay }}天</p>
      </div>
      <p>已连续打卡{{ serialTimes }}天</p>
    </div>
    <ul class="clock_list">
      <li
        :class="{
          'no' : item.afterTime && !item.isSuccess,
          'active' :  item.afterTime && item.isSuccess && !item.isContinuity,
          'on' :  item.afterTime && item.isSuccess && item.isContinuity
          }"
        v-for="item in lists">
        <a class="icon-ok-c" href="javascript:;"></a>
        <p>{{ item.clockedAt | Format }}</p>
      </li>
    </ul>
    <!-- isMyRecord &&  -->
    <a
      @click="toTaskPost()"
      v-show="!todayStatus"
      href="javascript:;"
      class="clock_btn">
      去打卡&nbsp;&nbsp;>></a>
  </div>
</template>

<script>
  import store from '../../vuex/store'
  import { getClockRecord } from '../../vuex/clock/actions'
  import { Indicator, Toast } from 'mint-ui'
  import $ from 'npm-zepto'
  import moment from 'moment'

  export default {
    store,
    data () {
      return {
        // startTime: '2016-07-14',
        // endTime: '2016-09-08'
        lists: [],
        loadSuccess: false
      }
    },
    vuex: {
      getters: {
        bbsId: state => state.route.query.bbsId,
        userId: state => state.route.query.userId,
        channelId: state => state.route.query.channelId,
        userName: state => state.route.query.userName,
        dates: ({ clock }) => clock.clockRecordList,
        finishDay: ({ clock }) => clock.finishDays,
        goalDay: ({ clock }) => clock.goalDays,
        rank: ({ clock }) => clock.rank,
        isMyRecord: ({ clock }) => clock.isMyRecord,
        todayStatus: ({ clock }) => (clock.todayStatus === 1),
        serialTimes: ({ clock }) => clock.serialTimes,
        scale: ({ clock }) => clock.scale
      },
      actions: {
        getClockRecord
      }
    },
    created () {
      Indicator.open('加载中...')
      this.showButton()
      let data = {
        bbs_id: this.bbsId,
        user_id: this.userId,
        is_my: 0
      }
      this.getClockRecord(data, this.success, this.fail)
    },
    watch: {
      scale () {
        this.rotateFn(this.scale)
      },
      dates () {
        this.isContinuitySeven(this.dates)
      }
    },
    ready () {
      this.rotateFn(this.scale)
    },
    methods: {
      rotateFn (scale) {
        let path = document.querySelector('#circles path')
        let length = document.querySelector('#circles path').getTotalLength()
        $('#circles svg path').eq(1).css({
          'transition': 'none',
          'WebkitTransition': 'none',
          'strokeDasharray': length + ' ' + length,
          'strokeDashoffset': length
        })
        path.getBoundingClientRect()
        $('#circles svg path').eq(1).css({
          'transition': 'stroke-dashoffset 2s ease-in-out',
          'WebkitTransition': 'stroke-dashoffset 2s ease-in-out',
          'strokeDashoffset': (1 - scale) * 307.919
        })
        $('.stars').css({
          'transform': 'rotate(' + scale + 'turn)',
          'WebkitTransform': 'rotate(' + scale + 'turn)',
          'transition': 'transform 2s ease-in-out',
          'WebkitTransition': 'stroke-dashoffset 2s ease-in-out'
        })
      },
      isContinuitySeven (dates) {
        let arr = []
        // 将数据转化成[1, 0, 1, 1 ...] 格式
        for (let i = 0, len = dates.length; i < len; i++) {
          arr.push(dates[i].isSuccess)
        }
        let d = 0
        // 将数据转化成[1, 0, 1, 2 ...] 格式
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] === 0) {
            d = 0
          } else {
            arr[i] += d
            d++
          }
        }
        // 得到连续7天的数
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] >= 7) {
            let n = i - arr[i] // 得到当前1前面还有几个连续的
            for (let j = n + 1; j <= i; j++) {
              dates[j].isContinuity = 1
            }
          } else {
            dates[i].isContinuity = 0
          }
        }
        // 得到开始时间到今天过了几天，dates做出相应的变动
        let startTime = moment(dates[0].clockedAt)
        let currentTime = moment()
        let dur = currentTime.diff(startTime, 'days')
        for (let i = 0; i < dur; i++) {
          if (dates[i]) {
            dates[i].afterTime = 1
          }
        }
        this.lists = dates
      },
      // 去打卡
      toTaskPost () {
        let bridge = window.tinfiniteBridge
        let title = this.userName + '打卡(' + this.finishDay + '/' + this.goalDay + ')'
        if (bridge && bridge.jumptoNativePage) {
          bridge.jumptoNativePage({
            pname: 'task_post',
            options: {
              channelId: this.channelId,
              bbsId: this.bbsId,
              title: title
            }
          })
        }
      },
      // 显示分享按钮
      showButton () {
        let bridge = window.tinfiniteBridge
        if (bridge && bridge.showButton) {
          bridge.showButton([{
            type: 1,
            value: '',
            callback: ''
          }])
        }
      },
      success () {
        this.loadSuccess = true
        Indicator.close()
      },
      fail () {
        Indicator.close()
        Toast('网络出错啦...')
      },
      timeInit () {
        moment.locale('zh-cn')
        // let create = moment(this.time).toObject().date
        let start = moment(this.startTime)
        let end = moment(this.endTime)
        let dur = end.diff(start, 'days')
        this.dates.push(start.format('M.DD'))
        for (let i = 1; i < dur; i++) {
          this.dates.push(start.add(1, 'day').format('M.DD'))
        }
      }
    }
  }
</script>
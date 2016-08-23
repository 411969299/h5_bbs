import Vue from 'vue'
import moment from 'moment'

export default function () {
  Vue.filter('default', (value, newValue) => {
    return value === '' ? newValue : value
  })

  Vue.filter('dateFormat', (value) => {
    moment.locale('zh-cn')
    if (!value) { return }
    let nowDay = moment().format('YYYY-MM-DD') // 当前年月日
    let proxDay = moment().subtract(1, 'days').format('YYYY-MM-DD') // 前一天年月日
    let commentDay = moment(value).format('YYYY-MM-DD')  // 传进来的年月日
    let nowYear = moment().format('YYYY') // 当前年份
    let commentYear = moment(value).format('YYYY') // 传进来的年份
    let nowHour = moment().format('YYYY-MM-DD HH') // 当前小时
    let commentHour = moment(value).format('YYYY-MM-DD HH') // 传进来的小时

    if (moment(nowDay).isSame(commentDay, 'day')) {
      if (moment(nowHour).isSame(commentHour, 'hour')) {
        return moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow()
      } else {
        return '今天' + moment(value).format('HH:mm')
      }
    } else if (moment(proxDay).isSame(commentDay, 'day')) {
      return '昨天' + moment(value).format('HH:mm')
    } else if (moment(nowYear).isSame(commentYear, 'year')) {
      return moment(value).format('YYYY-MM-DD')
    } else {
      return moment(value).format('YYYY-MM-DD')
    }
  })

  Vue.filter('Format', (value) => {
    moment.locale('zh-cn')
    if (!value) { return }
    let nowDay = moment().format('YYYY-MM-DD') // 当前年月日
    let nextDay = moment().add(1, 'days').format('YYYY-MM-DD') // 明天年月日
    let commentDay = moment(value).format('YYYY-MM-DD')  // 传进来的年月日

    if (moment(nowDay).isSame(commentDay, 'day')) {
      return '今天'
    } else if (moment(nextDay).isSame(commentDay, 'day')) {
      return '明天'
    } else {
      return moment(value).format('M.D')
    }
  })

  Vue.filter('AtUser', (value, data) => {
    let reg = /@[\u4e00-\u9fa5]+\s/i
    let string = value
    for (let i = 0, len = data.length; i < len; i++) {
      // let name = string.match(reg)[0].substring(1)
      string = string.replace(reg, '<span class="name" data-user-id="' + data[i].id + '">@' + data[i].fullname + '</span>')
    }
    return string
  })

  Vue.filter('timeFormat', (value) => {
    if (!value) return
    return moment(value).format('YYYY-MM-DD')
  })
}

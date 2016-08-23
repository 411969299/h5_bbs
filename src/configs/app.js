import APP_MAP from './appMap'

// 全局常量
const win = window
const loc = win.location
const host = loc.host
const port = loc.port

// 初始变量
let APP_NAME = ''
let APP_ID = ''
let APP_LOGO = ''
let APP_ICO = ''
let APP_HOST = ''
let APP_KEY = ''
let APP_IS_LOCAL = false
let APP_ENV_DEV = false
let APP_ENV_PRE = false
let APP_ENV_PRO = false
let APP_ENV_MOCK = false

let isLocalDev = false
let isLocalPre = false
let isLocalPro = false
let isLocalMock = false
let isDev = false
let isPre = false
let isPro = false

// for host
APP_HOST = host

// top level hostname
let topHostMatch = loc.hostname.match(/\.([^\.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]

// for host
APP_HOST = TOP_LEVEL_HOST

// for app key
APP_KEY = TOP_LEVEL_HOST.split('.')[0]

// for appId & appLogo
if (!TOP_LEVEL_HOST) {
  throw new Error('url is wrong!')
} else {
  APP_ID = APP_MAP[APP_KEY].appId
  APP_LOGO = APP_MAP[APP_KEY].logo
  APP_ICO = APP_MAP[APP_KEY].ico
}

// for env
if (port) {
  isLocalDev = host.indexOf('-dev.') !== -1
  isLocalPre = host.indexOf('-pre.') !== -1
  isLocalMock = host.indexOf('-mock.') !== -1
  isLocalPro = !(isLocalDev || isLocalPre || isLocalMock)
  APP_IS_LOCAL = true
} else {
  isDev = host.indexOf('-dev.') !== -1
  isPre = host.indexOf('-pre.') !== -1
  isPro = !(isDev || isPre)
}

APP_ENV_DEV = isLocalDev || isDev
APP_ENV_PRE = isLocalPre || isPre
APP_ENV_PRO = isLocalPro || isPro
APP_ENV_MOCK = isLocalMock

export { APP_NAME, APP_KEY, APP_HOST, APP_IS_LOCAL, APP_ID, APP_LOGO, APP_ICO, TOP_LEVEL_HOST, APP_ENV_DEV, APP_ENV_PRE, APP_ENV_PRO, APP_ENV_MOCK }

import cookieParser from 'cookie'
import { APP_ENV_DEV, APP_ENV_MOCK } from './app'

let cookie = cookieParser.parse(document.cookie)

let PREFIX = ''
if (APP_ENV_MOCK) {
  PREFIX = '//api-saas-mock.tinfinite.com/mockjs/1'
} else {
  PREFIX = '//api-saas' + (!APP_ENV_DEV ? '' : '-dev') + '.tinfinite.com'
}

const TOKEN = !APP_ENV_DEV ? cookie['_app_token'] : cookie['_app_token_dev']
const SOCKET_URI = (!APP_ENV_DEV) ? 'http://im-saas.tinfinite.com' : 'http://im-saas-dev.tinfinite.com'

export { PREFIX, TOKEN, SOCKET_URI }

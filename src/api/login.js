import axios from '../config/axios'

/**
 * 登录
 */
export const postLogin = (params) => axios({
  method: 'post',
  url: `/v1/appx/live/livePcLogin.do`,
  data: params
})

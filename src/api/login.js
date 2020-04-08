import axios from '../config/axios'
import axiosLogin from '../config/axiosLogin'

/**
 * 登录
 */
export const postLogin = (params) => axiosLogin({
  method: 'post',
  url: `/v1/appx/live/livePcLogin.do`,
  data: params
})

/**
 * 获取直播详情
 */
export const getLiveDetail = (params) => axios({
  method: 'post',
  url: `/v1/appx/live/getLiveDetail.do`,
  data: params
})

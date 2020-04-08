import axios from '../config/axios'

/**
 * 登录
 */
export const postLogin = (params) => axios({
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

export const postMix = (params) => axios({
  method: 'post',
  url: '/v1/appx/live/liveMixedFlow.do',
  data: params
})

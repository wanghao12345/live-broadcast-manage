import axios from 'axios'
import { filterEmptyData } from '../utils/url'

const serviceConfig = {
  baseURL: 'http://api1.leading-c.cn/mol',
  timeout: 5000,
  responseType: 'json',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json;charset=utf-8'
  }
}

const service = axios.create(serviceConfig)

service.interceptors.request.use(
  config => {
    config.params && (config.params = filterEmptyData(config.params))
    config.url = encodeURI(config.url)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.status === 200) {
      return res
    } else {
      Promise.reject(new Error(response.status || 'Error'))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service

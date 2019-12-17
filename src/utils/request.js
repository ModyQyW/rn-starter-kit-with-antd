import { AsyncStorage } from 'react-native'
import axios from 'axios'

/**
 * @typedef  {Object}  IResponse
 * @property {Boolean} suc
 * @property {String}  msg
 * @property {Any}     data
 */

// for dev env
const baseUrl = 'http://localhost:3000/api'
// for prod env
// const baseUrl = '';

// base url
axios.defaults.baseURL = baseUrl
// request header
const defualtHeaders = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
  Accept: 'application/json'
}
// timeout setting
axios.defaults.timeout = 10000 // 10s
// take cookie or not
axios.defaults.withCredentials = false
// validate response status
axios.defaults.validateStatus = status => (status >= 200 && status < 300) || status === 304
// max length of the content
axios.defaults.maxContentLength = 524288 // 0.5 MB
// max redirect times
axios.defaults.maxRedirects = 5
// response interceptor
axios.interceptors.response.use(
  response => response.data,
  (error) => {
    // just make it like api responses
    const err = {
      suc: false,
      msg: ''
    }
    // console.log(error.config);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of [200, 300) ∪ 304
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      const { status } = error.response
      switch (status) {
        case 403:
          err.msg = 'Forbidden'
          break
        case 404:
          err.msg = 'Not found'
          break
        case 500:
          err.msg = 'Internal server error'
          break
        default: break
      }
    } else if (error.request) {
      // The request was made but no response was received
      // console.log(error.request);
      err.msg = 'No response'
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', error.msg);
      err.msg = 'Request error'
    }
    return err
  }
)

export default {
  /**
   * @param  {object}              annoymous
   * @param  {string}              annoymous.url
   * @param  {any}                 annoymous.params
   * @return {Promise.<IResponse>}
   */
  get: async function ({ url, params = null }) {
    const token = await AsyncStorage.getItem('token')
    return axios({
      url,
      method: 'get',
      headers: {
        ...defualtHeaders,
        token
      },
      params
    })
  },
  /**
   * @param  {object}              annoymous
   * @param  {string}              annoymous.url
   * @param  {any}                 annoymous.params
   * @return {Promise.<IResponse>}
   */
  post: async function ({ url, data = null }) {
    const token = await AsyncStorage.getItem('token')
    return axios({
      url,
      method: 'post',
      headers: {
        ...defualtHeaders,
        token
      },
      data
    })
  },
  /**
   * @param  {object}              annoymous
   * @param  {string}              annoymous.url
   * @param  {any}                 annoymous.params
   * @return {Promise.<IResponse>}
   */
  uploadImage: async function ({ url, data = null }) {
    const token = await AsyncStorage.getItem('token')
    return axios({
      url,
      method: 'post',
      headers: {
        ...defualtHeaders,
        token,
        'Content-Type': 'image/*'
      },
      data
    })
  }
}

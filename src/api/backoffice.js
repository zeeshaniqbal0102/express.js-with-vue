import axios from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions';

export default {
  /**
   * Make an api call to the server. Token in local storage is required
   */
  Api(token, organizationid) {
    const instance = axios.create({
      baseURL: `${process.env.VUE_APP_SERVER_URL}/backoffice/`,
      withCredentials: false,
      headers: {
        'x-clientid': process.env.VUE_APP_SERVER_API_KEY,
        token: token || localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`),
        organizationid: organizationid || localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}organizationId`),
        'Cache-Control': 'no-cache',
        'x-timezone': localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}timezone`),
      },
      adapter: cacheAdapterEnhancer(axios.defaults.adapter),
    })

    // Request Interceptor
    instance.interceptors.request.use((config) => {
      // Do something before request is sent
      if (!config.params) { config.params = {} }
      // We want time sensitive data to come back with the correct timezone since everything is saved in utc
      config.params.timezone = localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}timezone`)
      return config;
    }, error => Promise.reject(error));

    // Response interceptor
    instance.interceptors.response.use((response) => {
      if (process.env.NODE_ENV === 'development')  console.log(response.data) // eslint-disable-line

      return response
    }, (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`)
      }
      return Promise.reject(error.response)
    })
    return instance
  },
  valid() {
    return this.Api().get('user/current')
      .then((response) => {
        if (response.status < 400) {
          return true
        }
        return false
      })
      .catch(() => false)
  },
  /**
   * Check if server is available
   */
  ping() {
    return this.Api().get('')
      .then(response => response.status === 200)
      .catch((error) => { throw error })
  },
  sendReceiptPDF(data) {
    return this.Api().post('/tools/email/receipt', data)
      .then(response => response.status === 200)
      .catch((error) => { throw error })
  },
}

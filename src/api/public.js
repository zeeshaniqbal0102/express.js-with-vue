import axios from 'axios'

const baseObj = {
  baseURL: `${process.env.VUE_APP_SERVER_URL}/public/`,
  withCredentials: false,
  headers: {
    'x-clientid': process.env.VUE_APP_SERVER_API_KEY,
  },
}

export default {
  /**
   * Make an api call to the server. Token in local storage is required
   */
  Api() {
    return axios.create(baseObj)
  },
  /**
   * Check if server is available
   */
  ping() {
    this.Api().get('')
      .then(response => response.status === 200)
  },
  States() {
    return this.Api().get('csp/state')
      .then(response => response.data)
  },
  Country() {
    return this.Api().get('csp/country')
      .then(response => response.data)
  },
  PaymentProcessors() {
    return this.Api().get('csp/paymentProcessors')
      .then(response => response.data)
  },
  MasterCategories() {
    return this.Api().get('csp/category')
      .then(response => response.data)
  },
  GetPlans(params) {
    return this.Api().get('billing/plans', { params })
      .then(response => response.data)
  },
}

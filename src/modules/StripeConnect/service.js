import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get Stripe Connect Info
   * @param {*} params Query Options
   */
  getInfo(params = {}) {
    return backofficeService.Api().get('/stripe/connect', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get state
   * @param {*} params Query Options
   */
  getState(params = {}) {
    return backofficeService.Api().get('/stripe/connect/state', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  authenticate(data) {
    return backofficeService.Api().post('/stripe/connect/authenticate', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  getLoginLink(params = {}) {
    return backofficeService.Api().get('/stripe/connect/loginLink', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  getLocations(params = {}) {
    return backofficeService.Api().get('/stripe/connect/locations', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  getLocationLoginLink(data) {
    return backofficeService.Api().post('/stripe/connect/loginLocationLink', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

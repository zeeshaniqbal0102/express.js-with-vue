import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get Integration Settings
   * @param {*} params Query Options
   */
  getAll(params) {
    return backofficeService.Api().get('/marketplace/apps', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get Integration by id
   * @param {*} params Query Options
   */
  getById(id, params) {
    return backofficeService.Api().get(`/marketplace/apps/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get Integration locations
   * @param {*} params Query Options
   */
  getLocations(id, params) {
    return backofficeService.Api().get(`/marketplace/apps/${id}/locations`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Enable App from location
   * @param {*} params LocationId mandatory
   */
  enable(id, data) {
    return backofficeService.Api().post(`/marketplace/apps/${id}/enable`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Disable App from location
   * @param {*} params LocationId mandatory
   */
  disable(id, data) {
    return backofficeService.Api().post(`/marketplace/apps/${id}/disable`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

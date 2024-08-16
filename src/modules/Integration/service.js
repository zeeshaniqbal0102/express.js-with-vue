import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get Integration Settings
   * @param {*} params Query Options
   */
  getAll(params) {
    return backofficeService.Api().get('settings/integration', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get Location Integration
   * @param {*} params Query Options
   */
  getIntegrationsForLocation(params) {
    return backofficeService.Api().get('/integration/organization/location', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

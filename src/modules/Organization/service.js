import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get All Settings
   * @param {*} params Query Options
   */
  getAll(params) {
    return backofficeService.Api().get('organization', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get All Settings
   * @param {*} params Query Options
   */
  getById(id, params = {}) {
    return backofficeService.Api().get(`organization/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get All Settings
   * @param {*} params Query Options
   */
  getCurrent(id, params = {}) {
    return backofficeService.Api().get('organization/current', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * New Organization
   * @param {*} params Query Options
   */
  create(data) {
    return backofficeService.Api().post('organization', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * update Organization
   * @param {*} params Query Options
   */
  update(id, data) {
    return backofficeService.Api().put(`organization/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

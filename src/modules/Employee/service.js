import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get list of products
   * @param {*} params
   * @param {*} params.limit
   * @param {*} params.offset
   * @param {*} params.search
   * @param {*} params.local Add LocalData to products
   */
  getAll(params) {
    return backofficeService.Api().get('employee', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get specific product
   * @param {*} id
   * @param {*} params
   * @param {*} params.local Add LocalData to product
   */
  getById(id, params = {}) {
    return backofficeService.Api().get(`employee/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Create a product. Will also initiate location data
   * @param {*} data
   */
  create(data) {
    return backofficeService.Api().post('employee', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Update specific product
   * @param {*} id
   * @param {*} data
   */
  update(id, data) {
    return backofficeService.Api().put(`employee/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Delete product
   * @param {} id
   * @param {*} params
   */
  delete(id, params) {
    return backofficeService.Api().delete(`employee/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  getTerminalPermissions(params) {
    return backofficeService.Api().get('employee/terminalPermission', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

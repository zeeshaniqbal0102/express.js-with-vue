import backofficeService from '@/api/backoffice'

export default {
  /**
   * Get list of roles
   * @param {*} params
   * @param {*} params.limit
   * @param {*} params.offset
   * @param {*} params.search
   */
  getAll(params) {
    return backofficeService.Api().get('employee/roles', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get specific roles
   * @param {*} id
   * @param {*} params
   */
  getById(id, params = {}) {
    return backofficeService.Api().get(`employee/roles/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Create a role
   * @param {*} data
   */
  create(data) {
    return backofficeService.Api().post('employee/roles', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Update specific role
   * @param {*} id
   * @param {*} data
   */
  update(id, data) {
    return backofficeService.Api().put(`employee/roles/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Delete role
   * @param {} id
   * @param {*} params
   */
  delete(id, params) {
    return backofficeService.Api().delete(`employee/roles/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

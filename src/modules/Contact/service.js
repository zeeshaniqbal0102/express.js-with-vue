import backOfficeService from '../../api/backoffice'

export default {
  /**
   * Get list of contacts
   * @param {*} params
   * @param {*} params.limit
   * @param {*} params.offset
   * @param {*} params.search
   */
  getAll(params) {
    return backOfficeService.Api().get('contact', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get specific contact
   * @param {*} id
   * @param {*} params
   */
  getById(id, params = {}) {
    return backOfficeService.Api().get(`contact/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Create a contact.
   * @param {*} data
   */
  create(data) {
    return backOfficeService.Api().post('contact', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Update specific contact
   * @param {*} id
   * @param {*} data
   */
  update(id, data) {
    return backOfficeService.Api().put(`contact/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Delete contact
   * @param {} id
   * @param {*} params
   */
  delete(id, params) {
    return backOfficeService.Api().delete(`contact/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

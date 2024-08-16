import backofficeService from '@/api/backoffice'

export default {
  /**
   * Get list of categories
   * @param {*} params
   * @param {*} params.limit
   * @param {*} params.offset
   * @param {*} params.search
   * @param {*} params.local Add LocalData to categories
   */
  getAll(params) {
    return backofficeService.Api().get('category', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get category by id
   * @param {*} params Query Options
   */
  getById(id, params) {
    return backofficeService.Api().get(`category/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Create a category. Will also initiate location data
   * @param {*} data
   */
  create(data) {
    return backofficeService.Api().post('category', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Update specific category
   * @param {*} id
   * @param {*} data
   */
  update(id, data) {
    return backofficeService.Api().put(`category/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Delete category
   * @param {} id
   * @param {*} params
   */
  delete(id, params) {
    return backofficeService.Api().delete(`category/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

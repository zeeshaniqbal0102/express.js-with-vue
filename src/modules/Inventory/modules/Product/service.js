import backofficeService from '@/api/backoffice'

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
    console.log('params', params)
    return backofficeService
      .Api()
      .get('product', { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   * Get specific product
   * @param {*} id
   * @param {*} params
   * @param {*} params.local Add LocalData to product
   */
  getById(id, params = {}) {
    return backofficeService
      .Api()
      .get(`product/${id}/locationAttributes`, { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   * Create a product. Will also initiate location data
   * @param {*} data
   */
  create(data) {
    return backofficeService
      .Api()
      .post('product', data)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   * Update specific product
   * @param {*} id
   * @param {*} data
   */
  update(id, data) {
    return backofficeService
      .Api()
      .put(`product/${id}`, data)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   * Delete product
   * @param {} id
   * @param {*} params
   */
  delete(id, params) {
    return backofficeService
      .Api()
      .delete(`product/${id}`, { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   * Get all product categories
   * @param {*} params Query options
   */
  getCategories(params = {}) {
    return backofficeService
      .Api()
      .get('category', { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   * Update specific product
   * @param {*} id
   * @param {*} data
   */
  itemTransfer(data) {
    console.log('item transfer fired')
    return backofficeService
      .Api()
      .put(`product/itemTransfer`, data)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
}

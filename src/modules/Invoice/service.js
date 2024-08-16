import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get list of invoices
   * @param {*} params
   * @param {*} params.limit
   * @param {*} params.offset
   */
  getAll(params) {
    return backofficeService.Api().get('invoice', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get specific invoice
   * @param {*} id
   * @param {*} params
   */
  getById(id, params = {}) {
    return backofficeService.Api().get(`invoice/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get specific invoice
   * @param {*} id
   * @param {*} params
   */
  getByInvoiceDetailId(id, params = {}) {
    return backofficeService.Api().get(`invoice/detail/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Create a invoice.
   * @param {*} data
   */
  create(data) {
    return backofficeService.Api().post('invoice', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Update an invoice
   * @param {*} data
   */
  update(id, data) {
    return backofficeService.Api().put(`invoice/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Create a invoice.
   * @param {*} data
   */
  void(id) {
    return backofficeService.Api().delete(`invoice/${id}`)
      .then(response => response.data)
      .catch((error) => { throw error })
  },

  /**
   * Get list of invoice attributes
   * @param {*} params
   * @param {*} params.limit
   * @param {*} params.offset
   */
  getAttributes(params) {
    return backofficeService.Api().get('invoice/attributes', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Create an attribute for the invoices, this includes the policies
   * @param {*} data
   */
  createAttribute(data) {
    return backofficeService.Api().post('invoice/attributes', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Update the invoice attribute
   * @param {*} id
   * @param {*} data
   */
  updateAttribute(id, data) {
    return backofficeService.Api().put(`invoice/attributes/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Delete the invoice attribute
   * @param {*} id
   */
  deleteAttribute(id) {
    return backofficeService.Api().delete(`invoice/attributes/${id}`)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get list of invoice detail types
   * @param {*} params
   * @param {*} params.limit
   * @param {*} params.offset
   */
  getDetailTypes(params) {
    return backofficeService.Api().get('invoice/types', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get All payments done towards invoices
   * @param {} params
   */
  getPayments(params = {}) {
    return backofficeService.Api().get('payment', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Update a payment
   * @param {*} data
   */
  updatePayment(id, data) {
    return backofficeService.Api().put(`payment/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

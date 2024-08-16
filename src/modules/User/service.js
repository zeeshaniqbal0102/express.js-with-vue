import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get All Settings
   * @param {*} params Query Options
   */
  getAll(params) {
    return backofficeService.Api().get('user', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get by id
   * @param {*} params Query Options
   */
  getById(id, params) {
    return backofficeService.Api().get(`user/${id}`, { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get current user using the api
   * @param {*} params Query Options
   */
  getCurrent(params) {
    return backofficeService.Api().get('user/current', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Get All invites
   * @param {*} params Query Options
   */
  getInvites(params) {
    return backofficeService.Api().get('user/invite', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Send user an invitation
   * @param {*} params Query Options
   */
  sendInvite(data) {
    return backofficeService.Api().post('user/invite', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Revoke existing invite
   * @param {*} params Query Options
   */
  revokeInvite(id) {
    return backofficeService.Api().delete(`user/invite/${id}`)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   *Update
   * @param {*} params Query Options
   */
  update(id, data) {
    return backofficeService.Api().put(`user/${id}`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

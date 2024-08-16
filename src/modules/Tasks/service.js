import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get All tasks
   * @param {*} params Query Options
   */
  getAll(params = {}) {
    return backofficeService.Api().get('task', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Accept a task
   * @param {*} params Query Options
   */
  acceptTask(id, data) {
    return backofficeService.Api().post(`task/${id}/accept`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Reject a task
   * @param {*} params Query Options
   */
  rejectTask(id, data) {
    return backofficeService.Api().post(`task/${id}/reject`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

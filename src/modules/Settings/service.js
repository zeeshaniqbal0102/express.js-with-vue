import backofficeService from '../../api/backoffice'

export default {
  /**
   * Get All Settings
   * @param {*} params Query Options
   */
  getAll(params) {
    return backofficeService.Api().get('settings/all', { params })
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Upload Image to media folder
   */
  async uploadMedia(image) {
    const bodyFormData = new FormData()
    const newFile = this.dataURLtoFile(image.dataUrl, image.name)
    bodyFormData.append('image', newFile)
    return backofficeService.Api().post('settings/media', bodyFormData)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  },
  Billing: {
    /**
     * Get All Settings
     * @param {*} params Query Options
     */
    getCustomer(params) {
      return backofficeService.Api().get('billing/customer', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
    /**
     * Get all cards on file
     * @param {*} params Query Options
     */
    getCards(params) {
      return backofficeService.Api().get('billing/cards', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
    /**
     * Make a card default
     * @param {*} params Query Options
     */
    setDefaultCard(data) {
      return backofficeService.Api().put('billing/defaultSource', data)
        .then(response => response.data)
        .catch((error) => { throw error })
    },
    /**
     * Make a card default
     * @param {*} params Query Options
     */
    addCard(data) {
      return backofficeService.Api().post('billing/cards', data)
        .then(response => response.data)
        .catch((error) => { throw error })
    },
    /**
     * Delete Card
     * @param {*} params Query Options
     */
    deleteCard(id) {
      return backofficeService.Api().delete(`billing/cards/${id}`)
        .then(response => response.data)
        .catch((error) => { throw error })
    },
  },
  Notification: {
    /**
     * Get All Notifications
     * @param {*} params Query Options
     */
    getAll(params) {
      return backofficeService.Api().get('/settings/notification', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
    /**
     * Get All Location notification settings
     * @param {*} params Query Options
     */
    getLocations(params) {
      return backofficeService.Api().get('/settings/notification/location', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
  },
  Integration: {
    /**
     * Get Organization Integration
     * @param {*} params Query Options
     */
    getAll(params) {
      return backofficeService.Api().get('/settings/integration', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
  },
}

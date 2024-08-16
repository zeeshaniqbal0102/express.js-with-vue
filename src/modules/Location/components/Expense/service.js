import backofficeService from '../../../../api/backoffice'

export default {

  
  /**
   * Enable LighSetting for location
   * @param {*} params LocationId mandatory
   */
  enableLightSetting(data) {
    return backofficeService.Api().post(`/expense/lightSetting/enable`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Disable LightSetting from location
   * @param {*} params LocationId mandatory
   */
  disableLightSetting(data) {
    return backofficeService.Api().post(`/expense/lightSetting/disable`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Update LightSetting from location
   * @param {*} params LocationId mandatory
   */
  updateLightSetting(data) {
    return backofficeService.Api().put(`/expense/lightSetting`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

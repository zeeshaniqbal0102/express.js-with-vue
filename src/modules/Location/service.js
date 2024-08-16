import backofficeService from '../../api/backoffice'

export default {

  
  /**
   * Enable LighSetting for location
   * @param {*} params LocationId mandatory
   */
  enableLightSetting(id, data) {
    return backofficeService.Api().post(`/expense/lightSetting/enable`, data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Disable LightSetting from location
   * @param {*} params LocationId mandatory
   */
  disableLightSetting(id, data) {
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
  /**
   * Get All Settings
   * @param {*} params Query Options
   */
  getAll(params) {
    return backofficeService
      .Api()
      .get('location', { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   * Get Location by id
   * @param {*} params Query Options
   */
  getbyId(id, params = {}) {
    return backofficeService
      .Api()
      .get(`location/${id}`, { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   * Create a location
   * @param {*} params Query Options
   */
  create(data) {
    return backofficeService
      .Api()
      .post('location', data)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  /**
   *get location Integration
   * @param {*} params Query Options
   */
  getIntegrationByLocation(id, params) {
    return backofficeService
      .Api()
      .get(`location/${id}/integrations`, { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  Reports: {
    /**
     * Get All Settings
     * @param {*} params Query Options
     */
    getLocationSales(params) {
      console.log('params, params', params)
      return backofficeService
        .Api()
        .get('reports/sales', { params })
        .then(response => response.data)
        .catch(error => {
          throw error
        })
    },
  },
  Billing: {
    /**
     * Get Subscription
     * @param {*} params Query Options
     */
    getInfo(id, params = {}) {
      return backofficeService
        .Api()
        .get(`location/${id}/billing`, { params })
        .then(response => response.data)
        .catch(error => {
          throw error
        })
    },
    /**
     * Get Subscription
     * @param {*} params Query Options
     */
    getSubscription(id, params = {}) {
      return backofficeService
        .Api()
        .get(`location/${id}/billing/subscription`, { params })
        .then(response => response.data)
        .catch(error => {
          throw error
        })
    },
    /**
     * Make a card default
     * @param {*} params Query Options
     */
    setDefaultCard(id, data) {
      return backofficeService
        .Api()
        .put(`location/${id}/billing/defaultSource`, data)
        .then(response => response.data)
        .catch(error => {
          throw error
        })
    },
    /**
     * Change Plan
     * @param {*} params Query Options
     */
    changePlan(id, data) {
      return backofficeService
        .Api()
        .post(`location/${id}/billing/changePlan`, data)
        .then(response => response.data)
        .catch(error => {
          throw error
        })
    },
  },
  Settings: {
    Register: {
      get(id, params) {
        return backofficeService
          .Api()
          .get(`location/${id}/settings/register`, { params })
          .then(response => response.data)
          .catch(error => {
            throw error
          })
      },
      update(id, data) {
        return backofficeService
          .Api()
          .put(`location/${id}/settings/register`, data)
          .then(response => response.data)
          .catch(error => {
            throw error
          })
      },
    },
    Notifications: {
      get(id, params) {
        return backofficeService
          .Api()
          .get(`location/${id}/settings/notification`, { params })
          .then(response => response.data)
          .catch(error => {
            throw error
          })
      },
      set(id, data) {
        console.log('data',data);
        return backofficeService
          .Api()
          .post(`location/${id}/settings/notification`, data)
          .then(response => response.data)
          .catch(error => {
            throw error
          })
      },
      remove(id, NotificationId, data) {
        return backofficeService
          .Api()
          .delete(`location/${id}/settings/notification/${NotificationId}`, data)
          .then(response => response.data)
          .catch(error => {
            throw error
          })
      },
    },
  },
}

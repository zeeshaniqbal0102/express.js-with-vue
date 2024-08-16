import backofficeService from '../../api/backoffice'

export default {
  /**
   *  Get token from server
   * @param {} id
   * @param {*} pin
   * @param {*} locationCode
   * @param {*} deviceCode
   * @param {*} deviceName
   */
  authenticate(params) {
    return backofficeService.Api().post('auth/token', {
      email: params.email,
      password: params.password,
    })
      .then((response) => {
        localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`, response.data.data.token)
        return response.data
      })
      .catch((error) => { throw error })
  },
  /**
   * Remove the location code store if there exist one/
   */
  resetOrganization() {
    return localStorage.removeItem(`${process.env.VUE_APP_STORAGE_PREFIX}organizationId`)
  },
  /**
   * Send forgot password email
   * @param {*} params Query Options
   */
  forgetPassword(data) {
    return backofficeService.Api().post('auth/forget', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Reset Password
   * @param {*} params Query Options
   */
  resetPassword(data) {
    return backofficeService.Api().post('auth/reset', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  Google: {
    getToken(data) {
      return backofficeService.Api().post('auth/google/token', data)
        .then((response) => {
          localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`, response.data.data.token)
          return response.data
        })
        .catch((error) => { throw error })
    },
  },
}

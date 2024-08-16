import backofficeService from '../../api/backoffice'

export default {
  /**
   * Submit the user data for sign up
   * @param {*} params Query Options
   */
  submit(data) {
    return backofficeService.Api().post('signup', data)
      .then((response) => {
        localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`, response.data.data)
        return response.data
      })
      .catch((error) => { throw error })
  },
  /**
   * Submit user token for verification
   * @param {*} params Query Options
   */
  verify(data) {
    return backofficeService.Api().post('signup/verifyEmail', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
  /**
   * Resubmit email
   * @param {*} params Query Options
   */
  resendVerifyEmail(data) {
    return backofficeService.Api().post('signup/resendVerification', data)
      .then(response => response.data)
      .catch((error) => { throw error })
  },
}

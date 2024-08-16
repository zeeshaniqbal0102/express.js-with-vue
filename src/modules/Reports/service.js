import backofficeService from '../../api/backoffice'

export default {
  Sales: {
    /**
     * Returns base sales like revenue, tax, net sales, discounts
     * @param {*} params
     */
    get(params = {}) {
      return backofficeService.Api().get('reports/sales', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
    getByLocation(params = {}) {
      return backofficeService.Api().get('reports/sales/byLocation', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
  },
  Location: {
    daySummary(params = {}) {
      return backofficeService.Api().get('reports/location/daySummary', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
    payments(params = {}) {
      return backofficeService.Api().get('reports/location/payments', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
    taxes(params = {}) {
      return backofficeService.Api().get('reports/location/taxes', { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
  },
  TimeClock: {
    /**
     * Returns timeClock of given employee 
     * @param {*} params
     */
    get(id, params = {}) {
      return backofficeService.Api().get(`reports/employee/${id}/timeClock`, { params })
        .then(response => response.data)
        .catch((error) => { throw error })
    },
  },
  sendReportPDF(data) {
    return backofficeService.Api().post('/tools/email/report', data)
      .then(response => response.status === 200)
      .catch((error) => { throw error })
  },
}

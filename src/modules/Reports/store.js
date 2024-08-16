const state = {
  dateSelector: false,
  reportName: ''
}

const getters = {
  getDateSelector(state) {
    return state.dateSelector
  },
  getReportName(state) {
    return state.reportName
  },
}

const actions = {
  setDateSelector({ commit }, payload) {
    console.log('setDateSelector')
    commit('SET_DATE_SELECTOR', payload)
  },
  setReportName({ commit }, payload) {
    commit('SET_REPORT_NAME', payload)
  },
}

const mutations = {
  SET_REPORT_NAME(state, payload) {
    state.reportName = payload
  },
  SET_DATE_SELECTOR(state, payload) {
    state.dateSelector = payload
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
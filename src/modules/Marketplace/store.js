import settingService from '../Settings/service'

export default {
  namespaced: true,
  state: {
    hasPaymentMethod: false,
  },
  getters: {
    hasPaymentMethod(state) {
      return state.hasPaymentMethod
    },
  },
  mutations: {
    setHasPaymentMethod(state, payload) {
      state.hasPaymentMethod = payload
    },
  },
  actions: {
    setHasPaymentMethod({ commit }, payload) {
      commit('setHasPaymentMethod', payload)
    },
    updateHasPayment({ commit }) {
      return settingService.Billing.getCards()
        .then((response) => {
          commit('setHasPaymentMethod', response.data.count > 0)
        })
    },
  },
}

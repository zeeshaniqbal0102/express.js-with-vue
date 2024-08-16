import settingService from './service'

export default {
  namespaced: true,
  state: {
    device: {
      name: null,
      deviceCode: null,
      locationCode: null,
      DeviceSetting: {
        customerDisplay: false,
        cloudPrinter: null,
        touchMode: null,
        registerLayout: 'default',
        receiptPageSize: '80mm',
        autoPrint: false,
        DefaultCashDrawerId: null,
      },
    },
    embedPDF: true,
    printer: {
      Star: false,
      host: '',
    },
  },
  getters: {
    touchMode(state) {
      return state.device.DeviceSetting.touchMode
    },
    embedPDF(state) {
      return state.embedPDF
    },
    device(state) {
      return state.device
    },
    receiptPageSize(state) {
      return state.device.DeviceSetting.receiptPageSize
    },
    autoPrint(state) {
      return state.device.DeviceSetting.autoPrint
    },
    printer(state) {
      return state.printer
    },
  },
  mutations: {
    initDevice(state, payload) {
      state.device = payload
    },
    initTouchMode(state, payload) {
      state.touchMode = payload
    },
    toggleTouchMode(state, payload) {
      if (payload) {
        state.device.DeviceSetting.touchMode = payload
      } else {
        state.device.DeviceSetting.touchMode = !state.device.DeviceSetting.touchMode
      }
    },
    toggleStar(state, payload) {
      if (payload) {
        state.printer.Star = payload
      } else {
        state.printer.Star = !state.printer.Star
      }
    },
    setPrinterHost(state, payload) {
      state.printer.host = payload
    },
    toggleEmbedPDF(state, payload) {
      if (payload) {
        state.embedPDF = payload
      } else {
        state.embedPDF = !state.embedPDF
      }
    },
  },
  actions: {
    initDevice({ dispatch, commit, state }) {
      const printer = localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}printer`)
      commit('setPrinterHost', printer)
      state.embedPDF = localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}embedPDF`) === 'true'
      return settingService.getDevice()
        .then((response) => {
          dispatch('initTouchMode')
          if (response.data.DeviceSetting && (!response.data.DeviceSetting.receiptPageSize || response.data.DeviceSetting.receiptPageSize === '')) response.data.DeviceSetting.receiptPageSize = '80mm'
          commit('initDevice', response.data)
        })
    },
    async saveDevice({ state }) {
      return settingService.updateDevice(state.device)
    },
    initTouchMode({ commit }) {
      const touchMode = localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}touchMode`)
      commit('initTouchMode', touchMode !== 'false')
    },
    toggleTouchMode({ commit }, payload) {
      localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}touchMode`, payload)
      commit('toggleTouchMode', payload)
    },
    toggleEmbedPDF({ commit }, payload) {
      localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}embedPDF`, payload)
      commit('toggleEmbedPDF', payload)
    },
    toggleStar({ commit }, payload) {
      localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}star`, payload)
      commit('toggleStar', payload)
    },
    setPrinterHost({ commit }, payload) {
      localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}printer`, payload)
      commit('setPrinterHost', payload)
    },
  },
}

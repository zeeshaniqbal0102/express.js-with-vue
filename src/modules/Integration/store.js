import integrationService from './service'
import settingsService from '../Settings/service'


export default {
  namespaced: true,
  state: {
    modules: {},
    locationModules: {},
  },
  getters: {
    modules(state) {
      return state.modules
    },
    locationModules(state) {
      return state.locationModules
    },
  },
  mutations: {
    addModule(state, payload) {
      state.modules[payload.name] = payload.data
    },
    addLocationModule(state, payload) {
      state.locationModules[payload.name] = payload.data
    },
  },
  actions: {
    setLocationIntegrations({ commit, state }) {
      state.locationModules = {}
      return integrationService.getIntegrationsForLocation({ active: true })
        .then(async (response) => {
          await Promise.all(response.data.map(integration => commit('addLocationModule', { name: integration.pubSubHook.toLowerCase(), data: integration })))
        })
    },
    setIntegrations({ commit, state }, payload) {
      if (payload) {
        return settingsService.Integration.getAll({ module: payload })
          .then(async (response) => {
            await Promise.all(response.data.map((integration) => {
              commit('addModule', { name: integration.pubSubHook.toLowerCase(), data: integration })
            }))
          })
      }
      state.modules = {}
      return settingsService.Integration.getAll()
        .then(async (response) => {
          await Promise.all(response.data.map((integration) => {
            commit('addModule', { name: integration.pubSubHook.toLowerCase(), data: integration })
          }))
        })
    },
  },
}

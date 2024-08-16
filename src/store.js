import publicService from './api/public'
import backofficeService from './api/backoffice'
import organizationSerivce from './modules/Organization/service'

export default {
  namespaced: true,
  state: {
    currentUser: {},
    States: [],
    Countries: [],
    defaultCountryCode: 840,
    currentOrganization: {},
  },
  getters: {
    currentUser(state) {
      return state.currentUser
    },
    currentOrganization(state) {
      return state.currentOrganization
    },
    states(state) {
      return state.States
    },
    countries(state) {
      return state.Countries
    },
    defaultCountryCode(state) {
      return state.defaultCountryCode
    },
  },
  actions: {
    initState({ commit }) {
      return publicService.States()
        .then((response) => {
          commit('initState', response.data)
        })
    },
    initCountries({ commit }) {
      return publicService.Country()
        .then((response) => {
          commit('initCountries', response.data)
        })
    },
    initUser({ commit }) {
      return backofficeService.Api().get('user/current')
        .then((response) => {
          commit('initUser', response.data.data)
        })
    },
    async initOrganization({ commit, dispatch }, payload) {
      if (!payload) {
        const id = localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}organizationId`)
        if (id) {
          return organizationSerivce.getById(id)
            .then((response) => {
              if (!response.data) {
                throw new Error('No organization found.')
              }
              commit('initOrganization', response.data)
            })
            .catch((error) => {
              throw error
            })
        }
        throw new Error('No organization found.')
      } else {
        commit('initOrganization', payload)
        return dispatch('initOrganizationId', payload.id)
      }
    },
    initOrganizationId({ commit }, payload) {
      return new Promise((resolve, reject) => {
        if (payload) {
          localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}organizationId`, payload)
        } else {
          payload = localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}organizationId`)
        }
        if (!payload) { return reject() }
        return resolve()
      })
    },
  },
  mutations: {
    initState(state, payload) {
      state.States = payload
    },
    initCountries(state, payload) {
      state.Countries = payload
    },
    initUser(state, payload) {
      state.currentUser = payload
    },
    initOrganization(state, payload) {
      state.currentOrganization = payload
    },
  },
}

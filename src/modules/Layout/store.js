const state = {
  drawer: true,
  currentEmployee: {},
  authenticated: false,
  helpPanel: false,
}

const mutations = {
  DRAWER_TOGGLE() {
    state.drawer = !state.drawer
  },
  HELP_TOGGLE() {
    state.helpPanel = !state.helpPanel
  },
}

const actions = {
  drawerToggle({ commit }) {
    commit('DRAWER_TOGGLE')
  },
  helpToggle({ commit }) {
    commit('HELP_TOGGLE')
  },
}

const getters = {
  getDrawer() {
    return state.drawer
  },
  helpPanel() {
    return state.helpPanel
  },
  getCurrentEmployee() {
    return state.currentEmployee
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

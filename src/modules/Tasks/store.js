import taskService from './service'

export default {
  namespaced: true,
  state: {
    tasks: [],
    loadingTasks: false,
  },
  getters: {
    tasks(state) {
      return state.tasks
    },
  },
  mutations: {
    addTasks(state, payload) {
      state.tasks.push(payload)
    },
    initTasks(state, payload) {
      state.tasks = payload
    },
  },
  actions: {
    initTasks({ commit }) {
      taskService.getAll({ status: 'pending' })
        .then((response) => {
          commit('initTasks', response.data)
        })
    },
    addTasks({ commit }, payload) {
      commit('addTasks', payload)
    },
    acceptTask() {

    },
  },
}

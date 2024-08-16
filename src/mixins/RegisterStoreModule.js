export default {
  methods: {
    registerStoreModule(moduleName, storeModule) {
      const store = this.$store;
      if (!(store && store.state && store.state[moduleName])) {
        return store.registerModule(moduleName, storeModule);
      }
      return false
    },
  },
}

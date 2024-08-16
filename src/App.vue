<template>
  <v-app>
    <vue-progress-bar></vue-progress-bar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import RegisterStoreModule from '@/mixins/RegisterStoreModule'
import globalStore from './store.js'

export default {
  name: 'App',
  mixins: [RegisterStoreModule],
  created() {
    this.registerStoreModule('global', globalStore)
    this.$store.dispatch('global/initState')
    this.$store.dispatch('global/initCountries')

    // Set the timezone if one is not set in the local storage
    // Use moment to guess the timezine
    if (!localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}timezone`)) localStorage.setItem(`${process.env.VUE_APP_STORAGE_PREFIX}timezone`, this.$moment.tz.guess())
  },
  data() {
    return {
      //
    }
  },
}
</script>
<style lang="scss">
  @import '@/scss/variable.scss';
  @import '@/scss/app.scss';
</style>

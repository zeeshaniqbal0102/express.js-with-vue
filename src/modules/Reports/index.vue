<template>
  <div>
    <!-- <v-btn
      fixed
      :to="{ name: 'reports-home' }"
      v-if="$route.name !== 'reports-home'"
      icon
    >
      <v-icon>mdi-arrow-left</v-icon></v-btn
    > -->
    <router-view></router-view>
  </div>
</template>
<script>
import RegisterStoreModule from '@/mixins/RegisterStoreModule'
import reportStore from '@/modules/Reports/store.js'

export default {
  name: 'reports',
  mixins: [RegisterStoreModule],
  created() {
    console.log('in index')
    this.registerStoreModule('reportView', reportStore)
  },
}
</script>

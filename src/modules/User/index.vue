<template>
  <v-container>
    <router-view></router-view>
  </v-container>
</template>
<script>
import RegisterStoreModule from '@/mixins/RegisterStoreModule'
import userStore from './store'

export default {
  name: 'user',
  mixins: [RegisterStoreModule],
  data() {
    return {}
  },
}
</script>

<template>
  <router-view></router-view>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import RegisterStoreModule from '@/mixins/RegisterStoreModule'
import invoiceStore from './store.js'

export default {
  name: 'invoice',
  mixins: [RegisterStoreModule],
  created() {
    this.registerStoreModule('invoice', invoiceStore)
  },
}
</script>

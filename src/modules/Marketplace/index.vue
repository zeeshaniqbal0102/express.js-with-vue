<template>
  <router-view></router-view>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import RegisterStoreModule from '@/mixins/RegisterStoreModule'
import marketplaceStore from './store'
import settingService from '../Settings/service.js'

export default {
  name: 'marketplace',
  mixins: [RegisterStoreModule],
  created() {
    this.registerStoreModule('marketplace', marketplaceStore)
    settingService.Billing.getCards()
      .then((response) => {
        this.setHasPaymentMethod(response.data.data.length > 0)
      })
  },
  methods: {
    ...mapActions('marketplace', ['setHasPaymentMethod']),
  },
}
</script>

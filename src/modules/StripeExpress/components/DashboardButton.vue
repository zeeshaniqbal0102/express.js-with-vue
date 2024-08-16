<template>
  <v-btn flat color="green" @click="openDashboard">View</v-btn>
</template>

<script>
import stripeConnectService from '../../StripeConnect/service'

export default {
  props: ['LocationId'],
  methods: {
    async openDashboard() {
      console.log('View Dashboard')
      const link = (await stripeConnectService.getLocationLoginLink({ LocationId: this.LocationId })).data
      window.open(link.url)
    },
  },
}
</script>

<style>

</style>

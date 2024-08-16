<template>
  <v-container>
    <!-- Stripe Express is not enabled. No integration found. Ask to sign up to start processing -->
    <div v-if="!modules.backofficestripeexpress">
      <v-card color="black" dark>
        <v-card-text>
          <h1>Start Processing Payments Today!</h1>
          <p>
            CellSmart uses Stripe to get you paid quickly and keep your personal and
            payment information secure. Thousands of companies around the world trust
            Stripe to process payments for their users. Set up a Stripe account to get
            paid with CellSmart.
          </p>
          <v-layout row wrap align-center>
            <h3>Enable Stripe Express</h3>
            <v-btn @click="enableStripeExpress">Enable</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </div>
    <div v-else>
      <!-- Stripe integration found and account is there. Options to see paymnets made, and terminals connected -->
      <!-- Option to sign up for Cash Discounting for free device by location-->
      <!-- Since it's by location then that means that the back end should payout based on location values -->
      <v-card>
        <v-toolbar :color="$style.card.header" class="elevation-0">
          <v-toolbar-title>
            <v-layout column fill-height>
              <span class="title">{{ $t('pageHeader.stripeExpress') }}</span>
            </v-layout>
          </v-toolbar-title>
        </v-toolbar>

        <Locations />
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import marketplaceService from '../Marketplace/service'
import stripeConnectService from '../StripeConnect/service'
import Locations from './components/Locations'

export default {
  name: 'stripe-express',
  components: {
    Locations,
  },
  data() {
    return {
      isLoading: false,
      stripeConnect: null,
    }
  },
  computed: {
    ...mapGetters('integration', ['modules']),
  },
  async created() {
    if (this.modules.backofficestripeexpress) {
      // Get stripe connect information
      // this.stripeConnect = (await stripeConnectService.getInfo()).data
    }
  },
  methods: {
    ...mapActions('integration', ['setIntegrations']),
    async enableStripeExpress() {
      await marketplaceService.enable(22)
      this.setIntegrations()
      this.$router.go()
    },
    async disableStripeExpress() {
      await marketplaceService.disable(22)
      this.setIntegrations()
    },
  },
}
</script>

<style></style>

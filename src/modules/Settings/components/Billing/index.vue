<template>
  <div>
    <v-container v-if="isLoading">
      <v-flex class="text-xs-center">
        <h2>{{ $t('pageHeader.loadingSettings')}}</h2>
      </v-flex>
      <v-layout justify-center>
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-layout>
    </v-container>
    <v-container v-else>
      <h2 class="mb-3 h2-header">{{ $t('pageHeader.billing') }}</h2>
      <v-card lazy v-if="customer" elevation="0">
          <v-card-text>
            <span class="font-weight-medium">{{ $t('labels.mainAccountHolder')}}:</span> {{ customer.email }} <br/>
            <span class="font-weight-medium">{{ $t('labels.subscriptionCount')}}:</span> {{ customer.subscriptions.count }} <br/>
            <span v-if="defaultCard.id">Charges will be made to {{ defaultCard.brand }} ending in <strong>{{ defaultCard.last4 }}</strong>  <br/></span>
            <update-payment-button class="mt-3" :defaultCardId="defaultCard.id" v-on:updateDefault="updateDefault"></update-payment-button>
          </v-card-text>
        </v-card>
    </v-container>
  </div>

</template>
<script>
import settingsService from '../../service.js'
import UpdatePaymentButton from './components/UpdatePayment'

export default {
  name: 'settings-billing',
  components: {
    UpdatePaymentButton,
  },
  data() {
    return {
      isLoading: true,
      customer: null,
      defaultCard: {},
      card: null,
      stripePublicKey: process.env.VUE_APP_STRIPE_PK,
      stripe: null,
    }
  },
  async created() {
    await this.loadBilling()
  },
  methods: {
    loadBilling() {
      this.isLoading = true
      settingsService.Billing.getCustomer()
        .then((response) => {
          this.isLoading = false
          response.data.sources.data.forEach((element) => {
            if (element.id === response.data.default_source) {
              this.defaultCard = (element.object === 'card') ? element : element.card
            }
          });
          this.customer = response.data
        })
        .catch((error) => {
          this.isLoading = false
          console.log(error)
        })
    },
    updateDefault(card) {
      this.defaultCard = card
    },
  },
}
</script>

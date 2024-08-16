<template>
  <v-dialog v-model="dialog" v-if="billing" max-width="500px">
    <Loading :loading="isLoading"></Loading>
    <v-btn slot="activator">Change Plan</v-btn>
    <v-card>
      <v-card-title>
        <h2>Change Plan</h2>
      </v-card-title>
      <v-card-text>
        <p>All plan changes are prorated.</p>
        <v-layout column="">
          <v-flex>
            <v-layout column wrap>
              <v-card v-for="plan in plans" :key="plan.id" class="ma-1">
              <v-card-text>
                <v-layout column>
                  <h3>{{ plan.name }}</h3> <br>
                  Price: {{ (parseFloat(plan.amount) > 0) ? `${$options.filters.currency(plan.amount)}` : 'Free' }}
                  <v-card-actions>
                    <span style="color: green;" v-if="plan.planId === billing.basePlanId"><h4>Current</h4></span>
                     <v-layout v-else justify-center="">
                        <v-flex v-if="plan.trialDays" shrink>
                          First time subscribers receive {{ plan.trialDays}} days trial before being charged. Cancel at any time!
                        </v-flex>
                        <v-btn @click="changePlan(plan.planId)">Pick This Plan</v-btn>
                    </v-layout>
                  </v-card-actions>
                </v-layout>
              </v-card-text>
              </v-card>
            </v-layout>
            <v-btn flat to="/marketplace">Looking to remove an add-on?</v-btn>
            <v-dialog max-width="290" class="ma-2">
                <a slot="activator" >Cancel Subscription</a>
                <v-card>
                  <v-card-title class="headline">Cancel Account</v-card-title>
                  <v-card-text>To cancel this entire subscription please email us at {{ clientEmail }}. If you would like to stop charges you may switch to the free plan.</v-card-text>
                </v-card>
              </v-dialog>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import locationService from '../service'
import publicService from '../../../api/public'
import Loading from '../../../components/LoadingDialog'

export default {
  name: 'location-billing-update-plan',
  props: ['location'],
  components: {
    Loading,
  },
  created() {
    publicService.GetPlans().then((response) => {
      this.plans = response.data
    })
    this.loadBilling()
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
      plans: null,
      billing: null,
      clientEmail: process.env.VUE_APP_CLIENT_EMAIL,
    }
  },
  methods: {
    loadBilling() {
      locationService.Billing.getInfo(this.location.id)
        .then((response) => {
          this.billing = response.data
        })
    },
    changePlan(planId) {
      this.isLoading = true
      this.$Progress.start()
      locationService.Billing.changePlan(this.location.id, { planId })
        .then((response) => {
          this.dialog = false
          this.loadBilling()
          this.isLoading = false
          this.$Progress.finish()
          this.$toasted.success('Plan was changed.', {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'check',
            duration: 2000,
          })
          this.$emit('updated')
        })
        .catch((error) => {
          this.isLoading = false
          this.$Progress.fail()
          this.$toasted.error(error.message || error.data.message, {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'error',
            duration: 2000,
          })
        })
    },
  },
}
</script>

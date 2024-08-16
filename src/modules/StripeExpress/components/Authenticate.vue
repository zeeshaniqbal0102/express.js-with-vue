<template>
  <div>
    <h3>{{status}}</h3>
  </div>
</template>

<script>
import stripeConnectService from '../../StripeConnect/service'

export default {
  name: 'stripe-express-authenticate',
  data() {
    return {
      authCode: null,
      status: null,
    }
  },
  async created() {
    this.authCode = this.$route.query.code
    this.status = 'Authenticating....'
  },
  watch: {
    async authCode() {
      // Make sure its not already registered
      if (this.$route.query.state) {
        stripeConnectService.authenticate({ code: this.authCode, state: this.$route.query.state })
          .then((response) => {
            this.status = 'Authentication Success. Do not Refresh.'
            this.$emit('done')
          }).catch((error) => {
            this.status = 'Failed to authenticate'
          })
      }
    },
  },
}
</script>

<style>

</style>

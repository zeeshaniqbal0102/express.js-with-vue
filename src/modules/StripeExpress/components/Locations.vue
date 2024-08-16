<template>
  <div>
    <Authenticate v-if="this.$route.query.code" @done="getList" />
    <v-data-table
      :headers="headers"
      :items="locations"
      :pagination.sync="pagination"
      :total-items="count"
      :loading="loading"
      :rows-per-page-items="rowsPerPageItems"
      expand
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left large-td">
          {{ props.item.name }}
          <v-chip
            v-if="props.item.hasConnectAccount"
            small
            color="#50f4a3"
            text-color="green darken-3"
          >
            <v-icon small color="green darken-3">loyalty</v-icon>
            <span class="ml-2">Configured</span>
          </v-chip>
        </td>
        <td class="justify-end layout px-0">
          <div v-if="props.item.includedInPlan">
            <v-dialog v-model="includedDialog" width="500">
              <template slot="activator">
                <v-btn flat color="green">Included</v-btn>
              </template>

              <v-card>
                <v-card-text>
                  This add-on is included within this locations plan at no extra cost.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="includedDialog = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <div v-else>
            <v-btn
              color="blue"
              flat
              v-if="!props.item.hasConnectAccount"
              @click="setup(props.item)"
              >Setup</v-btn
            >
            <DashboardButton v-else :LocationId="props.item.id" />
          </div>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import stripeConnectService from '../../StripeConnect/service'
import Authenticate from './Authenticate'
import DashboardButton from './DashboardButton'

export default {
  name: 'stripe-express-locations',
  components: {
    Authenticate,
    DashboardButton,
  },
  computed: {
    ...mapGetters('global', ['currentUser']),
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('labels.name'),
          value: 'name',
          sortable: true,
        },
        {
          text: '',
          value: 'action',
          sortable: false,
        },
      ],
      search: null,
      locations: [],
      count: 0,
      limit: 10,
      offset: 0,
      loading: false,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'name',
      },
    }
  },
  watch: {
    search() {
      if (this.search.length > 3 || this.search.length === 0) {
        this.getList()
      }
    },
    pagination: {
      handler() {
        this.pagination.totalItems = this.count
        this.getList()
      },
      deep: true,
    },
  },
  methods: {
    async setup(location) {
      console.log(location)
      const redirectURL = process.env.VUE_APP_STRIPE_CONNECT_REDIRECT
      const clientId = process.env.VUE_APP_STRIPE_CONNECT_CLIENT_ID
      const state = (await stripeConnectService.getState({ LocationId: location.id }))
        .data
      const locationCountry = `&stripe_user[country]=${location.Address.Country.A2}`
      const locationName = `&stripe_user[business_name]=${location.name}`
      const userFirstName = `&stripe_user[first_name]=${this.currentUser.firstName}`
      const userEmail = `&stripe_user[email]=${this.currentUser.email}`

      window.open(
        `https://connect.stripe.com/express/oauth/authorize?response_type=code${userEmail}${userFirstName}${locationName}${locationCountry}&redirect_uri=${redirectURL}&client_id=${clientId}&scope=read_write&state=${state}`,
        'name',
      )
    },
    getList() {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return stripeConnectService
        .getLocations({
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
        })
        .then(response => {
          this.locations = response.data
          this.count = response.count
          this.loading = false
          return response
        })
        .catch(error => {
          this.$toasted.error(error.data.message, {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'error',
            duration: 4000,
          })
        })
    },
  },
}
</script>

<style></style>

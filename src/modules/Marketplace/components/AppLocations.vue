<template>
  <v-card>
    <v-toolbar class="elevation-0" height="45" color="gray">
      <v-toolbar-title>
        <h1 class="subheading font-weight-regular">{{ $t('pageHeader.location') }}</h1>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
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
            <td class="text-xs-left large-td">{{ props.item.name }}
              <v-chip v-if="props.item.hasIntegration" small color="#50f4a3" text-color="green darken-3">
                <v-icon small color="green darken-3">loyalty</v-icon>
                <span class="ml-2">Installed</span>
                </v-chip>
              </td>
            <td  class="justify-end layout px-0">
              <div v-if="props.item.includedInPlan">
                <v-dialog
                  v-model="includedDialog"
                  width="500"
                >
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
                      <v-btn
                        color="primary"
                        flat
                        @click="includedDialog = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <div v-else>
                <span v-if="!props.item.hasIntegration">
                  <v-btn color="blue" flat v-if="!props.item.hasIntegration" @click="enableDialogOpen(props.item)">Enable</v-btn>
                </span>
                <span v-else>
                  <v-btn color="red" flat @click="disableDialogOpen(props.item)">Disable</v-btn>
                </span>
              </div>
            </td>
          </template>
        </v-data-table>
    </v-card-text>

    <!-- Enable Integration -->
        <v-dialog
          v-if="enabledDialog.dialog"
          v-model="enabledDialog.dialog"
          max-width="600"
        >
          <v-card>
            <v-card-title class="headline">Enable {{ app.name }}?</v-card-title>

            <v-card-text>
              Enabling this app will install {{ app.name }} for {{ enabledDialog.location.name }}. {{ app.price | currency }} will be added
              to this location's subscription.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="red darken-1"
                flat="flat"
                @click="enabledDialog.dialog = false"
                :disabled="enabledDialog.isLoading"
              >
                Cancel
              </v-btn>

              <v-btn
                color="green darken-1"
                flat="flat"
                @click="enableApp"
                v-if="(parseFloat(app.price) === 0) || hasPaymentMethod"
                :loading="enabledDialog.isLoading"
              >
                Agree
              </v-btn>
              <UpdatePaymentDialog v-else @update="updateHasPayment"></UpdatePaymentDialog>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Disable Integration -->
        <v-dialog
          v-if="disableDialog.dialog"
          v-model="disableDialog.dialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">Disable {{ app.name }}?</v-card-title>

            <v-card-text>
              Disabling {{ app.name }} for {{ disableDialog.location.name }} will stop this feature from working immediately. You will be credited for the
              remainder of the billing period on your next invoice.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="red darken-1"
                flat="flat"
                @click="disableDialog.dialog = false"
                :disabled="disableDialog.isLoading"
              >
                Cancel
              </v-btn>

              <v-btn
                color="green darken-1"
                flat="flat"
                @click="disableApp"
                :loading="disableDialog.isLoading"
              >
                Confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-card>

</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import marketplaceService from '../service.js'
import UpdatePaymentDialog from '../../Settings/components/Billing/components/UpdatePayment'

export default {
  name: 'marketplace-app-locations',
  props: ['id', 'app'],
  components: {
    UpdatePaymentDialog,
  },
  data() {
    return {
      includedDialog: false,
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
      enabledDialog: {
        dialog: false,
        location: null,
        isLoading: false,
      },
      disableDialog: {
        dialog: false,
        location: null,
        isLoading: false,
      },
    }
  },
  computed: {
    ...mapGetters('marketplace', ['hasPaymentMethod']),
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

    ...mapActions('marketplace', ['updateHasPayment']),

    getList() {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return marketplaceService
        .getLocations(this.id, {
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
        })
        .then((response) => {
          this.locations = response.data
          this.count = response.count
          this.loading = false
          return response
        })
        .catch((error) => {
          this.$toasted.error(error.data.message, {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'error',
            duration: 4000,
          })
        })
    },

    enableDialogOpen(location) {
      this.enabledDialog.location = location
      this.enabledDialog.dialog = true
    },

    enableApp() {
      this.enabledDialog.isLoading = true
      return marketplaceService.enable(this.id, {
        LocationId: this.enabledDialog.location.id,
      })
        .then((response) => {

          this.enabledDialog = {
            dialog: false,
            location: null,
            isLoading: false,
          }
          this.getList()
        })
        .catch((error) => {
          this.enabledDialog = {
            dialog: false,
            location: null,
            isLoading: false,
          }
          this.$toasted.error(error.data.message, {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'error',
            duration: 4000,
          })
        })
    },

    disableDialogOpen(location) {
      this.disableDialog.location = location
      this.disableDialog.dialog = true
    },

    disableApp() {
      this.disableDialog.isLoading = true
      return marketplaceService.disable(this.id, {
        LocationId: this.disableDialog.location.id,
      })
        .then((response) => {
          this.disableDialog = {
            dialog: false,
            location: null,
            isLoading: false,
          }
          this.getList()
        })
        .catch((error) => {
          this.disableDialog = {
            dialog: false,
            location: null,
            isLoading: false,
          }
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

<template>
  <v-layout v-if="organization" column>
    <v-flex>
      <v-card flat class="outlined">
        <v-card-text>
          <h2 class="mb-3 h2-header">{{ $t('pageHeader.general') }}</h2>
          <v-flex>
            <span class="font-weight-medium">{{ $t('labels.organizationName') }}:</span>
            {{ organization.name }}
          </v-flex>
          <v-flex>
            <span class="font-weight-medium">{{ $t('labels.referralCode') }}:</span>
            {{ organization.ReferralCode }}
          </v-flex>
          <div>
            <h3>Embed PDF</h3>
            <p>
              Uses browsers internal pdf viewer to see the receipts and reports. Enabled
              this may improve performance on desktop device but limit some features.
            </p>
            <v-switch
              v-model="embedPDF"
              :label="embedPDF ? 'Enabled' : 'Disabled'"
            >
            </v-switch>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    <!-- <v-flex>
      <v-card flat class="outlined">
        <v-card-text>
          <v-subheader>Revenue Calculation</v-subheader>
          <v-layout row wrap align-center>
            <v-flex grow xs12 md9 lg10>
              <span class="font-weight-medium">{{ $t('labels.revenue') }}</span>
              <p class="font-weight-light">
                <span>Calculat revenue base on expected invoice or actual payment received</span>
                <ul class="mt-2">
                  <li>                    <b>Expected:</b> Count invoice total amount in to revenue.</li>
                  <li>
                    <b>Actual:</b> Count payment receive in to revenue.</li>
                </ul>
              </p>
            </v-flex>
            <v-flex shrink xs12 md3 lg2>
              <v-switch
                v-model="organization.metadata.calculationByRevenue"
                color="teal"
                :label="organization.metadata.calculationByRevenue ? 'Expected' : 'Actual'"
              ></v-switch>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="pink" dark class="v-btn-with-radius"
           @click.stop.prevent="update">{{ $t('buttons.update') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex> -->
  </v-layout>
</template>
<script>

import settingService from '../../service.js'
import organizationService from '../../../Organization/service.js'


export default {
  name: 'settings-general',
  data() {
    return {
      organization: null,
      metadata: {
        calculationByRevenue: false,
      },
    }
  },
  created() {
    organizationService
      .getCurrent()
      .then((response) => {
        this.organization = response.data
        this.organization.metadata = {
          ...this.metadata,
        }
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  },
  methods: {
    update() {
      organizationService.update(this.organization.id, { 
        name: this.organization.name,
        email: this.organization.email,
        metadata: this.organization.metadata
         })
        .then((reuslt) => {
          this.$swal
            .mixin({
              toast: true,
              showConfirmButton: true,
              position: 'top-end',
              timer: 3000,
            })
            .fire({
              type: 'success',
              title: this.$t('toastMessage.text.updated'),
            })
        })
    },
  },
  computed: {
    embedPDF: {
      get() {
        return this.$store.getters['settings/embedPDF']
      },
      set(val) {
        this.$store.dispatch('settings/toggleEmbedPDF', val)
      },
    },
  },
}
</script>

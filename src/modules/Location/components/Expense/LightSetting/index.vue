<template>
  <v-dialog v-model="dialog"  max-width="500px">
    <Loading :loading="isLoading"></Loading>
    <v-btn slot="activator">lightSetting</v-btn>
    <v-card>
      <v-card-title>
        <h2>Light Setting</h2>
      </v-card-title>
      <v-card-text>
        <v-layout column="">
          <v-flex>
            <v-layout column wrap>
              <v-card>
                <v-card-text>
                  <v-layout column>
                    
                    <span v-if="Lightenabled">
                      <v-btn @click="disableLight">Disable Light</v-btn>
                    </span>
                    <span v-else>
                      <v-btn @click="enableLight">Enable Light</v-btn>
                    </span>

                    <span v-if="lightPercentageHidden">
                      <v-btn @click="updatePercentage"> show Percentage </v-btn>
                    </span>
                    <span v-else>
                      <v-btn @click="updatePercentage"> hide Percentage </v-btn>
                    </span>

                    <span v-if="lightAmountHidden">
                      <v-btn @click="updateAmount"> Show Amount </v-btn>
                    </span>
                    <span v-else>
                      <v-btn @click="updateAmount"> hide Amount </v-btn>
                    </span>

                  </v-layout>
                </v-card-text>
              </v-card>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>

import expenseService from '../service.js'
import Loading from '../../../../../components/LoadingDialog'
export default {
  name: 'location-expense-lightSetting',
  // props: ['location', ]
  props: {
    locationIntegration: {
      type: Object
    },
    LocationId: {
      type: Number
    },
    location: {
      type: Object
    }
  },
  components: {
    Loading,
  },
  computed: {
    Lightenabled() {
      if (
        this.locationIntegration &&
        this.locationIntegration.IntegrationSettings &&
        this.locationIntegration.IntegrationSettings.metadata &&
        this.locationIntegration.IntegrationSettings.metadata.lightSettings &&
        this.locationIntegration.IntegrationSettings.metadata.lightSettings.enable
      ){
        return true
      }
      
      else return false
    },

    lightPercentageHidden() {
      if (
        this.locationIntegration &&
        this.locationIntegration.IntegrationSettings &&
        this.locationIntegration.IntegrationSettings.metadata &&
        this.locationIntegration.IntegrationSettings.metadata.lightSettings &&
        this.locationIntegration.IntegrationSettings.metadata.lightSettings.hidePercentage
      )
      return true
      else return false
    },

    lightAmountHidden() {
      if (
        this.locationIntegration &&
        this.locationIntegration.IntegrationSettings &&
        this.locationIntegration.IntegrationSettings.metadata &&
        this.locationIntegration.IntegrationSettings.metadata.lightSettings &&
        this.locationIntegration.IntegrationSettings.metadata.lightSettings.hideAmount
      )
      return true
      else return false
    }

    
  },
  created() {
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
    }
  },
  methods: {
    enableLightSetting() {
      this.isLoading = true
      return expenseService.enableLightSetting({
        LocationId: this.LocationId,
      })
        .then((response) => {
          this.isLoading = false
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

    disableLightSetting() {
      // this.isLoading = true
      return expenseService.disableLightSetting({
        LocationId: this.LocationId
      })
        .then((response) => {
          // this.isLoading = false
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

    updateLightSetting(lightSettings) {
      return expenseService.updateLightSetting({
        LocationId: this.LocationId,
        lightSettings: lightSettings
      })
        .then((response) => {
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


    enableLight(location) {
      this.locationIntegration.IntegrationSettings.metadata.lightSettings.enable = true
      this.enableLightSetting()
    },
    disableLight(location) {
      this.locationIntegration.IntegrationSettings.metadata.lightSettings.enable = false
      this.disableLightSetting()
    },
    updatePercentage() {
      this.locationIntegration.IntegrationSettings.metadata.lightSettings.hidePercentage = 
        !this.locationIntegration.IntegrationSettings.metadata.lightSettings.hidePercentage
      this.updateLightSetting(this.locationIntegration.IntegrationSettings.metadata.lightSettings)
    },
    updateAmount() {
      this.locationIntegration.IntegrationSettings.metadata.lightSettings.hideAmount = 
        !this.locationIntegration.IntegrationSettings.metadata.lightSettings.hideAmount
      this.updateLightSetting(this.locationIntegration.IntegrationSettings.metadata.lightSettings)
    },
  },
}
</script>

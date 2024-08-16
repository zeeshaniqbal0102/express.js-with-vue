<template>
  <v-card>
    <v-card-text>
      <v-layout column>
        <!--  -->
        <!-- <v-layout row>
          <v-flex>
            <h4>Walk-in Customers</h4>
            <p>Allow invoices to be saved without a customer name. These customers will simply be named "Walk-in Customer". Turning this option off will mandate a customer be selected before creating an invoice.</p>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink>
            <v-checkbox v-model="registerSettings.walkInCustomer"></v-checkbox>
          </v-flex>
        </v-layout> -->
        <!--  -->
        <v-layout row>
          <v-flex>
            <h4>Shift System</h4>
            <p>Allows you to open and close the till on a cash drawer. Invoices will not be allowed unless the shift / till is open. At the end of each shift the option to count the cash in the drawer is given.
              You can set up the minimum cash the shift should be open with inside the register settings on the terminal.
            </p>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink>
            <v-checkbox v-model="registerSettings.shiftEnabled"></v-checkbox>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <h4>Require Inventory</h4>
            <p>Employees will not be able to sell serialized items unless the serial number has been purchased and entered into the stores serial list.
            </p>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink>
            <v-checkbox v-model="registerSettings.requireInventory"></v-checkbox>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-card-text>
     <v-layout justify-end row>
        <v-btn color="info" flat @click="cancel" >{{ $t('buttons.cancel') }}</v-btn>
        <v-btn color="info" @click="update">{{ $t('buttons.update') }}</v-btn>
      </v-layout>
  </v-card>
</template>
<script>
import locationService from '../service.js'

export default {
  name: 'location-settings',
  props: ['LocationId'],
  created() {
    this.loadSettings()
  },
  data() {
    return {
      registerSettings: {
        walkInCustomer: true,
        shiftEnabled: false,
        requireInventory: false,
      },
    }
  },
  methods: {
    async loadSettings() {
      this.$Progress.start()
      try {
        const registerSettings = (await locationService.Settings.Register.get(this.LocationId)).data
        this.registerSettings.walkInCustomer = registerSettings.walkInCustomer
        this.registerSettings.shiftEnabled = registerSettings.shiftEnabled
        this.registerSettings.requireInventory = registerSettings.requireInventory
        this.$Progress.finish()
      } catch (error) {
        this.$toasted.error(error.data.message, {
          position: 'top-right',
          showHideTransition: 'slide',
          icon: 'error',
          duration: 2000,
        })
        this.$Progress.fail()
      }
    },
    cancel() {
      this.loadSettings()
    },
    update() {
      this.$Progress.start()
      locationService.Settings.Register.update(this.LocationId, this.registerSettings)
        .then((response) => {
          this.$Progress.finish()
          this.$toasted.success('Setting was updated', {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'check',
            duration: 2000,
          })
        })
        .catch((error) => {
          this.$Progress.fail()
          this.$toasted.error(error.data.message, {
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

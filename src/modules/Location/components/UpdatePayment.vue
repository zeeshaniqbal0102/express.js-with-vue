<template>
   <div class="text-xs-center">
     <v-dialog
      v-model="isLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{$t('labels.pleaseStandBy')}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      width="500"
      lazy
    >
      <v-btn
        slot="activator"
        color="red lighten-2"
        dark
      >
        Update Payment Information
      </v-btn>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Update Payment Info
        </v-card-title>

        <v-card-text>
            <p>Unless there is a default card assigned to this location, all charges will be made on the default Organization card</p>
           <v-dialog
            max-width="500px"
            v-model="newCardDialog"
            >
             <v-btn
              slot="activator"
            >
              Add Card
            </v-btn>
              <v-card>
                <v-card-text>
                  Easily recharge next time by putting a credit card on file.
                </v-card-text>
                <v-card-text>
                  <card class='stripe-card'
                    :class='{ complete }'
                    :stripe='stripePublicKey'
                    @change='complete = $event.complete'
                  />
                </v-card-text>
                <v-card-text>
                  <v-layout justify-space-between="" align-center="">
                    <v-btn @click="dialog = false"> Cancel </v-btn>
                    <!-- <img src="../../../assets/images/powered_by_stripe.png" height="26px"> -->
                    <v-btn @click="addCard"> Save </v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-dialog>


          <v-data-table
            :items="cards"
            class="elevation-1"
            hide-actions
            hide-headers
            :loading="isLoading"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">
                {{ props.item.brand }} ending in {{ props.item.last4 }} <v-chip v-if="props.item.id === defaultCardId">Default</v-chip>
              </td>
               <td class="justify-end layout px-0" v-if="cards.length > 1">
                <v-menu bottom left offset-y>
                  <v-btn
                    slot="activator"
                    icon>
                    <v-icon>more_vert</v-icon>
                  </v-btn>

                  <v-list class="menu-button" width="100%">
                    <v-list-tile @click="setDefaultCard(props.item)" v-if="props.item.id !== defaultCardId">
                      <v-list-tile-title>{{ $t('buttons.makeDefault') }}</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="deleteCard(props.item)">
                      <v-list-tile-title>{{ $t('buttons.delete') }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
            </template>
            <template slot="no-data">
              <span v-if="isLoading">Loading...</span>
              <span v-else>No cards on file.</span>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { Card, createToken } from 'vue-stripe-elements-plus'
import settingsService from '../../Settings/service.js'
import locationService from '../service.js'

export default {
  name: 'billing-update-payment',
  props: ['locationId', 'defaultCardId'],
  components: {
    Card,
  },
  data() {
    return {
      dialog: false,
      newCardDialog: false,
      isLoading: false,
      cards: [],
      complete: false,
      stripePublicKey: process.env.VUE_APP_STRIPE_PK,
      stripe: null,
    }
  },
  methods: {
    loadCards() {
      this.$emit('update')
      this.$Progress.start()
      return settingsService.Billing.getCards()
        .then((response) => {
          // Data comes straight from stripe and they model their data inside data
          this.cards = response.data.data
          if (this.cards.length === 1) this.$emit('updateDefault', this.cards[0])
          this.$Progress.finish()
        })
        .catch((error) => {
          console.log(error)
          this.$Progress.error()
        })
    },
    async addCard() {
      try {
        this.isLoading = true
        const data = await createToken()
        const stripeResponse = await settingsService.Billing.addCard({ source: data.token.id })
        this.newCardDialog = false
        this.isLoading = false
        this.loadCards()
      } catch (error) {
        this.isLoading = false
        this.$toasted.error(error.message, {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 3500,
        })
      }
    },
    setDefaultCard(card) {
      this.isLoading = true
      this.$Progress.start()
      locationService.Billing.setDefaultCard(this.locationId, { source: card.id })
        .then((response) => {
          this.isLoading = false
          this.$Progress.finish()
          this.loadCards()
          this.$emit('updateDefault', card)
        })
        .catch((error) => {
          console.log(error)
          this.isLoading = false
          this.$Progress.fail()
        })
    },
    deleteCard(card) {
      this.$Progress.start()
      console.log('delete', card)
      settingsService.Billing.deleteCard(card.id)
        .then((response) => {
          this.$Progress.finish()
          this.loadCards()
        })
        .catch((error) => {
          console.log(error)
          this.$Progress.fail()
        })
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        this.isLoading = true
        this.loadCards()
          .then(() => {
            this.isLoading = false
          })
      }
    },
  },
}
</script>

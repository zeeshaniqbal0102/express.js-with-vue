<template>
  <div class="text-xs-center">
    <v-dialog v-model="isLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{$t('labels.pleaseStandBy')}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" width="500" lazy>
      <v-btn slot="activator" color="info" dark>Update Payment Information</v-btn>

      <v-card>
        <v-toolbar class="elevation-0" height="45" color="gray">
          <v-toolbar-title>
            <h1 class="subheading font-weight-regular">Update Payment Info</h1>
            <v-btn color="info" dark small absolute bottom right fab @click="newCardDialog = true">
              <v-icon>add</v-icon>
            </v-btn>
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <p>Default organization card will be used accross all locations that do not have a default card set.</p>
            <v-dialog max-width="450px" v-model="newCardDialog">
              <!-- <v-btn slot="activator">Add Card</v-btn> -->
              <v-card>
                <v-toolbar class="elevation-0" height="45" color="gray">
                  <v-toolbar-title >
                    <h1 class="title font-weight-regular">{{ $t('pageHeader.addCard') }}</h1>

                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="newCardDialog = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-container>
                  <span>Easily recharge next time by putting a credit card on file.</span>
                <v-card-text>
                  <card
                    class="stripe-card"
                    :class="{ complete }"
                    :stripe="stripePublicKey"
                    @change="complete = $event.complete"/>
                </v-card-text>

                </v-container>

                <v-card-actions>
                  <v-layout justify-space-between align-center>
                    <v-spacer></v-spacer>
                    <!-- <v-btn @click="dialog = false">Cancel</v-btn> -->
                    <!-- <img src="../../../assets/images/powered_by_stripe.png" height="26px"> -->
                    <v-btn color="info" @click="addCard">Save</v-btn>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-data-table
              :items="cards"
              class="card-table"
              hide-actions
              hide-headers
              :loading="isLoading">
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">
                  {{ props.item.brand }} ending in <strong>{{ props.item.last4 }}</strong>
                  <v-chip small v-if="props.item.id === defaultCardId" color="#D0E9FF" text-color="#3C4DA6">
                    <span>Default</span>
                  </v-chip>
                </td>
                <td class="justify-end layout px-0" v-if="cards.length > 1">
                  <v-menu bottom left offset-y>
                    <v-btn slot="activator" icon>
                      <v-icon>more_vert</v-icon>
                    </v-btn>

                    <v-list class="menu-button" width="100%">
                      <v-list-tile
                        @click="setDefaultCard(props.item)"
                        v-if="props.item.id !== defaultCardId"
                      >
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
          </v-container>
        </v-card-text>

        <v-divider/>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { Card, createToken } from 'vue-stripe-elements-plus';
import settingsService from '../../../service.js';

export default {
  name: 'billing-update-payment',
  props: ['defaultCardId'],
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
    };
  },
  methods: {
    loadCards() {
      this.$Progress.start();
      return settingsService.Billing.getCards()
        .then((response) => {
          // Data comes straight from stripe and they model their data inside data
          this.cards = response.data.data;
          if (this.cards.length === 1) this.$emit('updateDefault', this.cards[0]);
          this.$emit('update');
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log(error);
          this.$Progress.error();
        });
    },
    async addCard() {
      try {
        this.isLoading = true;
        const data = await createToken();
        const stripeResponse = await settingsService.Billing.addCard({
          source: data.token.id,
        });
        this.newCardDialog = false;
        this.isLoading = false;
        this.loadCards();
      } catch (error) {
        this.isLoading = false;
        this.$toasted.error(error.message, {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 3500,
        });
      }
    },
    setDefaultCard(card) {
      this.isLoading = true;
      this.$Progress.start();
      settingsService.Billing.setDefaultCard({ source: card.id })
        .then((response) => {
          this.isLoading = false;
          this.$Progress.finish();
          this.loadCards();
          this.$emit('updateDefault', card);
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          this.$Progress.fail();
        });
    },
    deleteCard(card) {
      this.$Progress.start();
      console.log('delete', card);
      settingsService.Billing.deleteCard(card.id)
        .then((response) => {
          this.$Progress.finish();
          this.loadCards();
        })
        .catch((error) => {
          console.log(error);
          this.$Progress.fail();
        });
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        this.isLoading = true;
        this.loadCards().then(() => {
          this.isLoading = false;
        });
      }
    },
  },
};
</script>

<style scoped>
  .card-table {
    border: solid 1px gray;
    border-radius: 4px;
  }
</style>

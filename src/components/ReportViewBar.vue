<template>
  <div>
    <v-toolbar class="no-print" dense flat color="grey lighten-3">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer> </v-spacer>
      <v-layout row wrap>
        <v-spacer></v-spacer>
        <v-flex shrink>
          <v-btn
            flat
            round
            small
            :fab="$vuetify.breakpoint.xsOnly"
            @click="print()"
            color="blue-grey"
            dark
          >
            <span v-if="!$vuetify.breakpoint.xsOnly">Print</span>
            <v-icon small :right="!$vuetify.breakpoint.xsOnly" dark>mdi-printer</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <!-- <v-row align="center" justify="end">
        <v-col class="shrink">
          <v-btn
            flat
            round
            small
            :fab="$vuetify.breakpoint.xsOnly"
            @click="print()"
            color="blue-grey"
            dark
          >
            <span v-if="!$vuetify.breakpoint.xsOnly">Print</span>
            <v-icon small :right="!$vuetify.breakpoint.xsOnly" dark
              >mdi-printer</v-icon
            >
          </v-btn>
        </v-col>
      </v-row> -->
    </v-toolbar>

    <v-container fluid v-if="location" class="pa-0">
      <v-card-text>
        <v-layout row wrap>
          <v-flex class="text-left text-capitalize">
            <div class=" headline font-weight-bold">
              {{ location.name }}
            </div>
            <div class="font-weight-medium">
              {{ location.Address.addressLine1 }}
              <div class="text-uppercase">{{ location.Address.city }}, {{ location.Address.State.name }} {{ location.Address.postalCode }} </div>
              
            </div>
            <div class="font-weight-medium">
              {{ location.phoneNumber }}
            </div>
            <div class="font-weight-medium text-lowercase">
              {{ location.email }}
            </div>
            <div class="font-weight-medium text-lowercase">
              {{ location.website }}
            </div>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink class="text-right">
            <div class="mt-2 display-2 font-weight-black blue--text text-uppercase">
              {{ title }}
            </div>
            <div class="mt-3 font-weight-regular" v-if="start">
              <v-layout row justify-end>
                <v-flex>
                  <div class="text-right">FROM</div>
                  <div class="text-right">TO:</div>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex shrink>
                  <div class="text-left">
                    {{ start | moment('MM/DD/YYYY') }}
                  </div>
                  <div class="text-left">
                    {{ end | moment('MM/DD/YYYY') }}
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: ['title', 'start', 'end', 'location'],
  name: 'report-view-bar',
  async created() {
    
    // if (!this.location) {
      // await this.$store.dispatch('global/initLocation');
      // await this.$store.dispatch('global/initEmployee');
      // this.initBusiness();
      // this.initUser();
    // }
    document.title = `Report - ${this.title}`;
  },
  methods: {
    ...mapActions('global', ['initLocation', 'initEmployee']),
    print() {
      window.print();
    },
  },
};
</script>

<style scoped></style>

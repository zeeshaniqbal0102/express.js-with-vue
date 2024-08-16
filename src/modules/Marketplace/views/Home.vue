<template>
  <v-layout column>
    <v-card height="100px" color="#3798F0" dark class="border-r-0">
      <v-card-text class="text-xs-center">
        <h1 class="display-1 font-weight-light">Marketplace</h1>
        <h4 class="body-1 font-weight-light">Tools for your business</h4>
      </v-card-text>
    </v-card>
    <v-container>
      <v-layout row wrap>

        <v-flex xs6 sm3 class="pa-2" v-for="app in apps" :key="app.id">
          <v-card class="text-xs-center" hover :to="`/marketplace/app/${app.id}`">
            <v-img v-if="app.imageURL" :src="app.imageURL" height="80px"></v-img>
            <v-card-text>
              <v-layout column>
                <h3 class="title font-weight-regular" >{{ app.name }}</h3>
                <v-layout class="mt-2" align-center justify-space-between row fill-height>
                  <div>
                    <span>Price: </span>
                    <span class="green--text font-weight-medium">{{ (app.price > 0) ? $options.filters.currency(app.price) : 'Free'}}</span>
                  </div>
                </v-layout>
                <div class="mt-2">{{ (locationModules[app.pubSubHook.toLowerCase()]) ? `Installed in ${locationModules[app.pubSubHook.toLowerCase()].LocationIntegrations.length} locations`: ''}}</div>

              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>
      <h4 class="text-xs-center ma-5 font-weight-light title">Many more coming soon</h4>
    </v-container>

  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import marketplaceService from '../service.js'

export default {
  name: 'marketplace-home',
  async created() {
    this.isLoading = true
    this.loadApps()
  },
  data() {
    return {
      count: 0,
      apps: [],
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters('integration', ['locationModules', 'modules']),
  },
  methods: {
    loadApps() {
      return marketplaceService.getAll({
        active: true,
        audience: 'terminal',
      })
        .then((response) => {
          this.apps = response.data
          this.count = response.count
        })
    },
  },
}
</script>

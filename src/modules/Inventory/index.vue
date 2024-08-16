<template>
  <div>
    <router-view v-if="this.locationModules.terminalinventory"></router-view>
    <div v-else>
      <v-container fluid class="pa-0 ma-0" id="login" style="overflow=hidden">
        <v-container fill-height="">
          <v-layout class="text-xs-center" align-center justify-center row fill-height>
            <v-flex xs10 md6 lg4>
              <v-card>
                <v-container>
                  <h2>Upgrade today!</h2>
                  <p>None of your locations have Inventory enabled.</p>
                  <v-btn class="mb-4" to="/marketplace/app/2">Enable Inventory</v-btn>
                  <p>If you have recently purchased this module, refresh the app.</p>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-container>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'inventory',
  created() {
  },
  computed: {
    ...mapGetters('integration', ['locationModules', 'modules']),
  },
}
</script>

<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-btn
      slot="activator" flat
        small
        class="hidden-sm-and-down ma-0">
        <v-flex >{{ $t('buttons.launchTerminal') }}</v-flex>
      </v-btn>

      <v-btn
      slot="activator"
        color="red lighten-2"
        dark
        small
        icon
        class="ma-0 hidden-md-and-up">
        <v-icon class="">mdi-open-in-new</v-icon>
      </v-btn>

      <v-card>
        <v-card-title
          class="headline "
          primary-title
        >
          Launch Terminal
        </v-card-title>
        <v-card-text>
          Start making sales by opening the terminal for your store.
           <v-list>
          <v-list-tile
            v-for="item in locations"
            :key="item.id"
            avatar
          >

            <v-list-tile-content>
              <v-list-tile-title v-html="item.name"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action >
              <v-btn icon flat :href="`${terminalURL}/login/location?code=${item.code}`" target="_blank">
                <v-icon >mdi-open-in-new</v-icon>
              </v-btn>

            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import locationService from '../../Location/service.js'

export default {
  name: 'launch-terminal',
  data() {
    return {
      terminalURL: process.env.VUE_APP_TERMINALURL,
      dialog: false,
      locations: [],
    }
  },
  created() {
    locationService.getAll()
      .then((response) => {
        this.locations = response.data
      })
  },
}
</script>

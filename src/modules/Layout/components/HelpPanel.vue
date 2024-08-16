<template>
  <v-navigation-drawer app="app" v-model="$store.state.layout.helpPanel" temporary right hide-overlay="">
    <v-layout column fill-height>
      <v-container>
        <v-layout column>
          <v-layout row>
            <v-flex shrink><v-btn icon @click="helpToggle"><v-icon>close</v-icon></v-btn></v-flex>
            <v-flex shrink>
              <h2 class="text-xs-center mt-2">Smart Help</h2>
            </v-flex>
          </v-layout>
          <v-divider class="my-2"></v-divider>
          <portal-target name="help"></portal-target>
        </v-layout>
      </v-container>
      <v-spacer></v-spacer>
     <v-flex shrink class="ma-2">
        <v-layout column="">
          <a  href="mailto:help@cellsmartpos.com">help@cellsmartpos.com</a>
          <!-- <a href="tel:+3473912600">Call us</a> -->
          <a href="https://cellsmartpos.com" target="_blank">Powered by CellSmart POS</a>
       </v-layout>
     </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'help-panel',
  data() {
    return {
      currentRoute: null,
    }
  },
  computed: {
    ...mapGetters('layout', ['helpPanel']),
  },
  methods: {
    ...mapActions('layout', ['helpToggle']),
  },
  watch: {
    helpPanel(val) {
      if (val) {
        console.log(this.$route)
      }
    },
  },
}
</script>
<style>
a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

</style>

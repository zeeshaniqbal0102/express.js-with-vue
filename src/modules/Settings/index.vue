<template>
  <v-container class="desktop-view-container" grid-list-md fluid overflow-hidden>
    <v-layout row fill-height>
      <v-flex shrink class="hidden-xs-only">
        <nav-bar></nav-bar>
      </v-flex>
      <v-flex grow>
        <v-layout column>
          <span class="hidden-sm-and-up">
            <nav-bar></nav-bar>
          </span>
          <div class="ml-3">
            <router-view />
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import NavBar from './components/NavBar'

export default {
  name: 'settings',
  components: {
    NavBar,
  },
  data() {
    return {}
  },
}
</script>
<style scoped>
.desktop-view-container {
  height: calc(100vh - 58px);
}
</style>

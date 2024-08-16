<template>
  <div>
    <v-toolbar
    app="app"
    flat
    clipped-right="clipped-right"
    color="white"
    fixed
    height="58"
    extension-height="48"
    ref="toolbar"
    id="app-toolbar"
  >
    <v-toolbar-side-icon
      @click.stop="drawerToggle"
      v-show="!stateless"
    ></v-toolbar-side-icon>
    <v-toolbar-title>
      <v-layout row align-center>
        <!-- Change to organization -->
        <h5 class="subheading font-weight-light">{{ currentOrganization.name }}</h5>
      </v-layout>
    </v-toolbar-title>
    <v-spacer />
    <v-btn icon @click.stop="helpToggle" v-show="!stateless">
      <v-icon>help</v-icon>
    </v-btn>
    <LaunchTerminal class="px-1"></LaunchTerminal>
    <TasksButton></TasksButton>
    <toolbar-menu />
  </v-toolbar>
  <v-divider></v-divider>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ToolbarMenu from './Menu.vue'
import TasksButton from '../../Tasks/components/Button'
import LaunchTerminal from './LaunchTerminal'

export default {
  data() {
    return {
      stateless: false,
    }
  },
  methods: {
    ...mapActions('layout', ['drawerToggle', 'helpToggle']),
  },
  computed: {
    ...mapGetters('global', ['currentOrganization']),
  },
  components: {
    ToolbarMenu,
    TasksButton,
    LaunchTerminal,
  },
}
</script>

<style scoped></style>

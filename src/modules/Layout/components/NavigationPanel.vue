<template>
  <v-navigation-drawer
    class="info"
    dark
    id="app-drawer"
    app="app"
    v-model="$store.state.layout.drawer"
  >
    <v-layout class="logo-box" align-center justify-center row fill-height>
      <router-link class="logo-class" to="/">
        <img src="../../../assets/logo-light-icon.png" width="40" />
        <img class="mb-2" src="../../../assets/logo-light-text.png" />
      </router-link>
    </v-layout>
    <!-- <v-divider color="white"></v-divider> -->
    <v-list dark dense="dense" expand="expand">
      <template v-for="item in items">
        <v-list-group
          class="mb-2"
          v-if="item.items"
          :group="item.group"
          :prepend-icon="item.icon"
          no-action="no-action"
        >
          <v-list-tile
            active-class="highlighted"
            slot="activator"
            ripple="ripple"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <template v-for="(subItem, i) in item.items">
            <v-list-group
              class="mb-2"
              v-if="subItem.items"
              :group="subItem.group"
              sub-group="sub-group"
            >
              <v-list-tile slot="activator" ripple="ripple">
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-chip
                class="white--text pa-0 v-chip--x-small"
                v-if="subItem.badge"
                :color="subItem.color || 'primary'"
                disabled="disabled"
                slot="appendIcon"
                >{{ subItem.badge }}</v-chip
              >
            </v-list-group>
            <v-list-tile
              v-else
              :key="i"
              :to="!subItem.href ? { path: subItem.path } : null"
              :href="subItem.href"
              :target="subItem.target"
              rel="noopener"
              :disabled="subItem.disabled"
              ripple="ripple"
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  <span>{{ subItem.title }}</span>
                </v-list-tile-title>
              </v-list-tile-content>
              <v-chip
                class="white--text pa-0 v-chip--x-small"
                v-if="subItem.badge"
                :color="subItem.color || 'primary'"
                disabled="disabled"
                >{{ subItem.badge }}</v-chip
              >
              <v-list-tile-action v-if="subItem.action">
                <v-icon :class="[subItem.actionClass || 'success--text']">{{
                  subItem.action
                }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list-group>
        <v-subheader v-else-if="item.header">{{ item.header }}</v-subheader>
        <v-divider v-else-if="item.divider"></v-divider>
        <v-list-tile
          v-else="v-else"
          :to="!item.href ? { path: item.path } : null"
          :href="item.href"
          ripple="ripple"
          :disabled="item.disabled"
          :target="item.target"
          rel="noopener"
        >
          <v-list-tile-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-chip
            class="white--text pa-0 v-chip--x-small"
            v-if="item.badge"
            :color="item.color || 'primary'"
            disabled="disabled"
            >{{ item.badge }}</v-chip
          >
          <v-list-tile-action v-if="item.subAction">
            <v-icon class="success--text">{{ item.subAction }}</v-icon>
          </v-list-tile-action>
          <v-chip
            class="caption blue lighten-2 white--text mx-0"
            v-else-if="item.chip"
            label="label"
            small="small"
            >{{ item.chip }}</v-chip
          >
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      items: [],
      mini: false,
      right: null,
    }
  },
  computed: {
    ...mapGetters('integration', ['modules']),
  },
  mounted() {
    this.loadNav()
  },
  methods: {
    loadNav() {
      this.items = []
      this.items.push({ header: 'Back Office' })
      // this.items.push({
      //   title: this.$t('sideBar.home'),
      //   icon: 'mdi-home',
      //   name: 'home',
      //   path: '/home',
      // })
      // this.items.push({ divider: true })

      this.items.push({
        title: this.$t('sideBar.locations'),
        icon: 'mdi-store',
        name: 'location',
        path: '/location',
      })
      this.items.push({ divider: true })
      this.items.push({
        title: this.$t('sideBar.contacts'),
        icon: 'mdi-account',
        name: 'contact',
        path: '/contact',
      })

      this.items.push({
        title: this.$t('sideBar.inventory'),
        group: '',
        icon: 'mdi-barcode-scan',
        name: 'inventory',
        path: '/inventory',
        items: [
          {
            name: 'Product',
            title: this.$t('sideBar.product'),
            path: '/inventory/product',
          },
          {
            name: 'Category',
            title: this.$t('sideBar.category'),
            path: '/inventory/category',
          },
          {
            name: 'ItemTransfer',
            title: 'Item Transfer',
            path: '/inventory/item-transfer',
          },
        ],
      })

      this.items.push({
        title: this.$t('sideBar.employees'),
        group: '',
        icon: 'mdi-account-group',
        name: 'employee',
        path: '/employee',
        items: [
          {
            name: 'Manage',
            title: this.$t('sideBar.manage'),
            path: '/employee/list',
          },
          {
            name: 'Roles',
            title: this.$t('sideBar.locationRoles'),
            path: '/employee/role',
          },
        ],
      })

      this.items.push({
        title: this.$t('sideBar.reviewInvoice'),
        icon: 'mdi-receipt',
        name: 'invoice',
        path: '/invoice',
      })

      this.items.push({
        title: this.$t('sideBar.marketplace'),
        icon: 'mdi-apps',
        name: 'marketplace',
        path: '/marketplace',
      })

      this.items.push({
        title: this.$t('sideBar.stripeExpress'),
        icon: 'mdi-calculator',
        name: 'stripeExpress',
        path: '/stripeExpress',
      })

      this.items.push({
        title: this.$t('sideBar.reports'),
        icon: 'mdi-file-chart',
        name: 'reports',
        path: '/reports',
      })

      // this.items.push({ divider: true })
      // this.items.push({
      //   title: this.$t('sideBar.integrations'),
      //   icon: 'mdi-apps',
      //   name: 'integrations',
      //   path: '/integrations',
      // })
      // this.items.push({ divider: true })

      this.items.push({
        title: this.$t('sideBar.settings'),
        icon: 'mdi-settings',
        name: 'settings',
        path: '/settings',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/variable.scss';

.sidebar-nav {
  padding: 8px 35px 8px 15px;
  display: block;
  font-size: 15px;
  border-radius: 4px;
  white-space: nowrap;
  color: $sidebar-text;
}

.logo-box {
  height: 58px;
  // background-color: #3a3a3a;
}
.v-chip--x-small {
  font-size: 10px;
  height: 16px;
}

.v-chip--x-small .v-chip__content {
  line-height: 1;
  padding: 8px;
}
</style>

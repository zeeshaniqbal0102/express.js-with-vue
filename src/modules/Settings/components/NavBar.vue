<template>
  <div>
    <div class="hidden-sm-and-up">
      <v-select :items="items" label="Settings" item-avatar="icon" item-text="title" solo>
        <template slot="item" slot-scope="data">
          <v-list-tile
            class="mb-2 full-width"
            :key="data.item.name"
            :to="!data.item.path ? { name: data.item.name } : { path: data.item.path }"
            ripple
            :disabled="data.item.disabled"
            :target="data.item.target"
            rel="noopener"
          >
            <v-list-tile-action v-if="data.item.icon">
              <v-icon>{{ data.item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ data.item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-chip
              class="white--text pa-0 v-chip--x-small"
              v-if="data.item.badge"
              :color="data.item.color || 'primary'"
              disabled="disabled"
            >{{ data.item.badge }}</v-chip>
            <v-list-tile-action v-if="data.item.subAction">
              <v-icon class="success--text">{{ data.item.subAction }}</v-icon>
            </v-list-tile-action>
            <v-chip
              class="caption blue lighten-2 white--text mx-0"
              v-else-if="data.item.chip"
              label="label"
              small="small"
            >{{ data.item.chip }}</v-chip>
          </v-list-tile>
        </template>
      </v-select>
    </div>
    <div class="hidden-xs-only">
      <v-navigation-drawer style="background-color: transparent" stateless value="true">
        <v-list class="sidebar-nav" dense>
          <template v-for="item in items">
            <v-list-group
              class="mb-2"
              v-if="item.items"
              :group="item.group"
              :prepend-icon="item.icon"
              :key="item.name"
              no-action
            >
              <v-list-tile slot="activator" ripple>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <template v-for="(subItem, i) in item.items">
                <v-list-group
                  class="mb-2"
                  v-if="subItem.items"
                  :group="subItem.group"
                  sub-group
                  :key="subItem.name"
                >
                  <v-list-tile slot="activator" ripple>
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
                  >{{ subItem.badge }}</v-chip>
                </v-list-group>
                <v-list-tile
                  v-else
                  :key="i"
                  :to="!item.path ? { name: item.name } : { path: item.path }"
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
                  >{{ subItem.badge }}</v-chip>
                  <v-list-tile-action v-if="subItem.action">
                    <v-icon :class="[subItem.actionClass || 'success--text']">{{ subItem.action }}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list-group>
            <v-subheader
              class="grey--text"
              v-else-if="item.header"
              :key="item.header"
            >{{ item.header }}</v-subheader>
            <v-divider class="mb-2" v-else-if="item.divider" :key="item.divider"></v-divider>
            <v-list-tile
              class="mb-2"
              v-else
              :key="item.name"
              :to="(item.href) ? null : !item.path ? { name: item.name } : { path: item.path }"
              :href="item.href"
              ripple
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
              >{{ item.badge }}</v-chip>
              <v-list-tile-action v-if="item.subAction">
                <v-icon class="success--text">{{ item.subAction }}</v-icon>
              </v-list-tile-action>
              <v-chip
                class="caption blue lighten-2 white--text mx-0"
                v-else-if="item.chip"
                label="label"
                small="small"
              >{{ item.chip }}</v-chip>
            </v-list-tile>
          </template>
        </v-list>
      </v-navigation-drawer>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'settings-navbar',
  data() {
    return {
      items: [],
      mini: false,
      right: null,
    };
  },
  mounted() {
    this.loadNav();
  },
  watch: {
    settings: {
      handler() {
        this.loadNav();
      },
      deep: true,
    },
  },
  methods: {
    loadNav() {
      this.items = [];
      this.items.push({ header: this.$t('sideBar.setting') });
      this.items.push({
        title: this.$t('sideBar.general'),
        icon: 'mdi-home',
        name: this.$t('sideBar.general'),
        path: '/settings/general',
      });
      //  this.items.push({
      //   title: this.$t("sideBar.notification"),
      //   icon: "mdi-bell",
      //   name: this.$t("sideBar.notification"),
      //   path: "/settings/notification"
      // });
      this.items.push({
        title: this.$t('sideBar.users'),
        icon: 'mdi-account',
        name: this.$t('sideBar.user'),
        path: '/settings/user',
      });
      // this.items.push({
      //   title: this.$t('sideBar.employees'),
      //   icon: 'mdi-account',
      //   name: 'Employees',
      //   path: '/settings/employee',
      // })
      this.items.push({
        title: this.$t('sideBar.billing'),
        icon: 'mdi-coin',
        name: this.$t('sideBar.billing'),
        path: '/settings/billing',
      });

      // this.items.push({
      //   title: 'Security',
      //   icon: 'mdi-security',
      //   name: 'Security',
      //   path: '/settings/security',
      // })
    },
  },
};
</script>

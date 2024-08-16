<template >
  <div class="text-xs-center">
    <v-menu v-model="menu" :close-on-content-click="true" offset-y :nudge-width="200">
      <template v-slot:activator="{ on }">
        <v-btn data-cy="menuUserBtn" icon v-on="on">
          <v-avatar size="38px">
            <img v-if="currentUser.imageURL" :src="currentUser.imageURL" alt="User">
            <img v-else src="../../../assets/images/user.jpeg" alt="User">
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-layout>
                <img class="menu-img" v-if="currentUser.imageURL" :src="currentUser.imageURL" alt="User" />
                <img class="menu-img" v-else src="../../../assets/images/user.jpeg" alt="User" />
                <v-flex class="ml-2">
                  <v-list-tile-title>{{ currentUser.name }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ currentUser.email}}</v-list-tile-sub-title>
                </v-flex>
              </v-layout>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn data-cy="menuUserEditBtn" :to="`/settings/user/${currentUser.id}/edit`" dark small color="purple" fab icon>
                <v-icon>edit</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list></v-list>
        <v-card-actions>
          <v-btn
            flat
            to="/login/organization"
            v-if="currentUser.organizationCount &gt; 1"
          >{{ $t('labels.changeOrganization') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn data-cy="menuLogoutBtn" color="info" to="/logout">{{ $t('buttons.logout') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'layout-menu',
  data() {
    return {
      fav: true,
      menu: false,
      message: false,
      hints: true,
    };
  },
  computed: {
    ...mapGetters('global', ['currentUser']),
  },
};
</script>

<style scoped>
  .menu-box {
    border: white solid 0.1em;
    padding: 7px;
    border-radius: 10px;
    cursor: pointer;
  }
  .menu-img {
    border-radius: 4px;
    width: 45px;
    height: 48px;
  }
</style>

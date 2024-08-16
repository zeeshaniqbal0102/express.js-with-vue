<template>
  <div class="text-xs-center">
    <v-card class="outlined " flat >
      <v-progress-linear
        indeterminate
        v-if="isLoading"
        color="pink"
        height="5"
        class="ma-0"
      ></v-progress-linear>

      <div v-else>
        <v-card dark flat class="tile" color="info">
          <v-card-text>
            <h2 class="headline font-weight-regular">
              {{ $t('labels.selectOrganization') }}
            </h2>
          </v-card-text>
        </v-card>

        <v-card-text>
          <v-list
            two-line
            style="max-height:600px; max-width:600px; overflow:auto;"
          >
            <template v-for="(item, index) in organizations">
              <v-list-tile  @click="setOrganization(item)">
                <v-list-tile-content data-cy="moduleAuthComponentSelectOrganization">
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.email"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider
                color="white"
                v-if="index + 1 < organizations.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="login" flat class="ma-0" color="pink" large block dark>
          {{ $t('buttons.cancel') }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import userService from '../../User/service.js'

export default {
  name: 'authentication-select-organization',
  props: ['Organizations'],
  data() {
    return {
      organizations: [],
      isLoading: true,
      noOrganization: false,
    }
  },
  async created() {
    if (this.Organizations) {
      this.organizations = this.Organizations
      this.isLoading = false
      console.log('org', this.organizations)
    } else {
      // User ended up here maybe to change the org. Get list of organizations
      try {
        const response = await userService.getCurrent({ includeOrganizations: true })
        if (!response.data || !response.data.Organizations)
          throw new Error('Error getting organizations')
        if (response.data.Organizations.length === 0) {
          this.$router.push('/newOrganization')
        } else if (response.data.Organizations.length === 1) {
          this.setOrganization(this.setOrganization(response.data.Organizations[0]))
        } else {
          this.organizations = response.data.Organizations
        }
        this.isLoading = false
      } catch (error) {
        console.log(error)
      }
    }
  },
  methods: {
    ...mapActions('global', ['initOrganization']),
    login() {
      this.$router.push({ path: '/login' })
    },
    async setOrganization(val) {
      await this.initOrganization(val)
        .then(() => {
          this.$router.push({ path: '/' })
        })
        .catch(error => {
          console.log(error)
        })
    },
    submit() {},
  },
}
</script>

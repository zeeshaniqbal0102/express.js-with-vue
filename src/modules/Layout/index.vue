<template>
  <div>
    <div v-if="!loading">
      <toolbar />

      <navbar />
      <HelpPanel></HelpPanel>
      <v-content>
        <v-card
          class="border-r-0"
          color="red darken-4"
          dark
          v-if="!currentUser.verified && !closeNotVerified"
        >
          <v-card-text>
            <v-layout align-space-around justify-space-around row fill-height>
              <v-layout column>
                <h1 class="headline font-weight-regular">Email is not Verified</h1>
                <h2 class="subheading font-weight-regular">
                  some of the features will not work untill you verify email.
                </h2>
              </v-layout>
              <v-spacer />
              <v-btn outline round @click="resendVerify">Send Again</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
        <router-view></router-view>
      </v-content>
    </div>
    <div v-else>
      <v-dialog v-model="loading" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            {{ $t('labels.pleaseStandBy') }}
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RegisterStoreModule from '@/mixins/RegisterStoreModule'
import layoutStore from './store'
import integrationStore from '../Integration/store.js'
import settingStore from '@/modules/Settings/store.js'
import tasksStore from '@/modules/Tasks/store.js'
import Navbar from '@/modules/Layout/components/NavigationPanel.vue'
import HelpPanel from '@/modules/Layout/components/HelpPanel.vue'
import Toolbar from '@/modules/Layout/components/Toolbar.vue'
import backofficeService from '../../api/backoffice.js'
import signUpService from '../SignUp/service.js'

export default {
  name: 'layout',
  mixins: [RegisterStoreModule],
  async mounted() {
    this.registerStoreModule('layout', layoutStore)
    await this.registerStoreModule('integration', integrationStore)
    await this.registerStoreModule('settings', settingStore)
    await this.registerStoreModule('tasks', tasksStore)
    await this.checkToken()
    await this.$store.dispatch('global/initUser')
    await this.$store.dispatch('global/initOrganization').catch(error => {
      console.log(this.currentUser)
      if (this.currentUser.organizationCount === 0) {
        this.$router.push('/newOrganization')
      } else {
        this.$router.push({ name: 'authentication-select-organization' })
      }
    })
    await this.$store.dispatch('integration/setIntegrations')
    await this.$store.dispatch('integration/setLocationIntegrations')
    this.loading = false
    await this.$store.dispatch('tasks/initTasks')
    this.pollData()
  },
  components: {
    Navbar,
    Toolbar,
    HelpPanel,
  },
  computed: {
    ...mapGetters('global', ['currentUser']),
  },
  props: {
    source: String,
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  data() {
    return {
      closeNotVerified: false,
      loading: true,
      authenticated: true,
      polling: null,
    }
  },
  watch: {
    authenticated(val) {
      if (!val) {
        this.$router.push('/login')
      }
    },
  },
  methods: {
    async checkToken() {
      this.authenticated = await backofficeService.valid()
    },
    pollData() {
      this.polling = setInterval(() => {
        if (!localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`)) {
          this.authenticated = false
        }
      }, 1000)
    },
    resendVerify() {
      signUpService
        .resendVerifyEmail({ email: this.currentUser.email })
        .then(response => {
          this.$Progress.finish()
          this.closeNotVerified = true
        })
        .catch(error => {
          this.$Progress.fail()
          this.isLoading = false
          this.error = true
          this.errorMessage = error.data.message
        })
    },
  },
}
</script>
<style>
.desktop-view-container {
  height: calc(100vh - 58px);
  width: 100%;
}
.touch-view-container {
  height: calc(100vh - 58px);
  /* height: calc((calc(var(--vh, 1vh) * 100)) - 58px); */
  /* height: calc(var(--vh, 1vh) * 100); */
  width: 100%;
}
.full-width {
  width: 100%;
}
/* Allow v-select items to grow vertically and limit the horizontal grow*/
.v-menu__content > .v-select-list > .v-list > div > a {
  min-height: 48px !important;
  height: auto !important;
  max-width: 600px;
}
/* Limits the size of a td within a datatable */
.small-td {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Limits the size of a td within a datatable */
.medium-td {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Limits the size of a td within a datatable */
.large-td {
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

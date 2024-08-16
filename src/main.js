import Vue from 'vue';
import VueAnalytics from 'vue-analytics'
import './plugins/vuetify'
import './plugins/vue-progressbar'
import i18n from './plugins/vueI18n'
import './plugins/vue-filter'
import './plugins/portal-vue'
import './plugins/vue-moment'
import './plugins/vue-toasted'
import './plugins/sweetalert2'
import './plugins/style'
import './plugins/vue-google-charts'
import './plugins/fontAwesome'
import './plugins/vue-google-oauth2'
import './plugins/vue-js-toggle-button'
import './plugins/vue-date-time-picker'
import './plugins/csp-component'
import './plugins/vue-image-upload-resize'
import App from './App.vue';
import router from './router';
import store from './plugins/vuex'
import './registerServiceWorker';

Vue.config.productionTip = false;

const isProd = ((process.env.NODE_ENV === 'production') || (process.env.NODE_ENV === 'staging'))

Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GOOGLE_ANALYTICS,
  router,
  debug: {
    enabled: !isProd,
    sendHitTask: !isProd,
  },
})

new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');

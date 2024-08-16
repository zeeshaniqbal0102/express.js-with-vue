import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'cellsmart-lang'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages, // set locale messages
})

export default i18n
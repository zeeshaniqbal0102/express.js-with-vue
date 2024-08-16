<template>
  <div>
    <router-view></router-view>
    <DateSelector @submit="openReport" />
  </div>
</template>
<script>
import RegisterStoreModule from '@/mixins/RegisterStoreModule'
import reportStore from '@/modules/Reports/store.js'
import { mapActions, mapGetters } from 'vuex'
import DateSelector from '@/modules/Reports/DateSelector.vue';

export default {
  name: 'location',
  mixins: [RegisterStoreModule],
  components:{
    DateSelector,
  },
  created() {
    this.registerStoreModule('reportView', reportStore)
  },
  computed: {
    ...mapGetters('reportView', ['getReportName']),
  },
  methods: {
    ...mapActions('reportView', ['setDateSelector', 'setReportName']),
    // openReport(link) {
    //   const routeData = this.$router.resolve({
    //     path: `/reportView/${link}`,
    //   })
    //   window.open(routeData.href, '_blank')
    //   window.postMessage({
    //     action: 'OPENREPORT',
    //     data: routeData.href,
    //   })
    // },
    openReport(val) {
      console.log('report', val)
      const routeData = this.$router.resolve({
        path: `/reportview/${this.getReportName}?start=${val.start}&end=${val.end}`,
      })
      window.open(routeData.href, '_blank')
      window.postMessage({
        action: 'OPENREPORT',
        data: routeData.href,
      })
    },
    openDateSelector(val) {
      this.setReportName(val)
      this.setDateSelector(true)
    },
  },
}
</script>

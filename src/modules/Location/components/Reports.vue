<template>
  <v-container>
    <!-- <v-btn @click="openDateSelector(`location/${LocationId}/saleSummary`)">new Sale Summary</v-btn> -->
    <v-dialog v-model="dialog" fullscreen transition="false">
      <v-toolbar dense color="info" dark>
        <v-toolbar-title>Report Viewer</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-btn slot="activator" @click="openReport('daySummary')">Sale Summary</v-btn>
      <v-btn slot="activator" @click="openReport('payments')">Payments</v-btn>
      <v-btn slot="activator" @click="openReport('quarterlyTaxes')"
        >Quarterly Taxes</v-btn
      >
      <v-btn slot="activator" @click="openReport('monthlyTaxes')">Monthly Taxes</v-btn>
      <v-btn slot="activator" @click="openReport('timeClock')">TimeClock</v-btn>
      <v-card height="80%" class="pa-5 tile" v-if="dialog">
        <v-card-text>
          <v-layout row wrap>
            <v-flex sm3>
              <DateTimePicker
                defaultRange="toDay"
                :range="true"
                :hideTime="true"
                v-model="dateTime"
              />
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex shrink class="ml-3">
              <div class="font-weight-medium">From</div>
              <div>{{ dateTime.start | moment('LLLL') }}</div>
            </v-flex>
            <v-flex shrink class="mx-2">
              <v-divider vertical></v-divider>
            </v-flex>
            <v-flex shrink>
              <div class="font-weight-medium">To</div>
              <div>{{ dateTime.end | moment('LLLL') }}</div>
            </v-flex>
          </v-layout>

          <!-- <VueCtkDateTimePicker
            v-if="startEndPicker"
            v-model="start"
            :onlyDate="true"
            :noButtonNow="true"
            format="YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            formatted="MM/DD/YY"
          />
          <VueCtkDateTimePicker
            v-if="yearPicker"
            v-model="start"
            :onlyDate="true"
            :noButtonNow="true"
            format="YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            formatted="YYYY"
          /> -->
        </v-card-text>
        <component
          v-if="start"
          :key="start"
          :is="dynamicComponent"
          :dateTime="dateTime"
          :LocationId="LocationId"
          :location="location"
          v-on:close="closeReport"
        ></component>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import DaySummary from '../../Reports/Location/DaySummary'
import Payments from '../../Reports/Location/Payments'
import QuarterlyTaxes from '../../Reports/Location/QuarterlyTaxes'
import MonthlyTaxes from '../../Reports/Location/MonthlyTaxes'
import { mapActions, mapGetters } from 'vuex'

const DateTimePicker = () => import('@/components/DateTimePicker')

export default {
  name: 'location-reports',
  props: ['LocationId', 'location'],
  data() {
    return {
      dateTime: {
        start: this.$moment()
          .startOf('day')
          .toISOString(),
        end: this.$moment()
          .endOf('day')
          .toISOString(),
      },
      startEndPicker: true,
      yearPicker: false,
      dialog: false,
      dynamicComponent: null,
    }
  },
  components: {
    DaySummary,
    Payments,
    QuarterlyTaxes,
    MonthlyTaxes,
    DateTimePicker,
  },
  watch: {
    dialog(val) {
      if (!val) this.dynamicComponent = null
    },
  },

  computed: {
    ...mapGetters('reportView', ['getReportName']),

    start() {
      return this.dateTime.start
    },
    end() {
      return this.dateTime.end
    },
  },
  methods: {
    ...mapActions('reportView', ['setDateSelector', 'setReportName']),

    // openReport(val) {
    //   const routeData = this.$router.resolve({
    //     path: `/reportview/${this.getReportName}?start=${val.start}&end=${val.end}`,
    //   });
    //   window.open(routeData.href, '_blank');
    //   window.postMessage({
    //     action: 'OPENREPORT',
    //     data: routeData.href,
    //   })
    // },
    openDateSelector(val) {
      this.setReportName(val)
      this.setDateSelector(true)
    },
    closeReport() {
      this.dialog = false
      this.startEndPicker = true
      this.yearPicker = false
      this.dynamicComponent = null
    },
    openReport(report) {
      switch (report) {
        case 'daySummary':
          this.dynamicComponent = DaySummary
          this.startEndPicker = true
          this.yearPicker = false
          break
        case 'payments':
          this.dynamicComponent = Payments
          this.startEndPicker = true
          this.yearPicker = false
          break
        case 'quarterlyTaxes':
          this.dynamicComponent = QuarterlyTaxes
          this.startEndPicker = false
          this.yearPicker = true
          break
        case 'monthlyTaxes':
          this.dynamicComponent = MonthlyTaxes
          this.startEndPicker = false
          this.yearPicker = true
          break
        case 'timeClock':
          this.$router.push({
            name: 'reports-timeClock',
            params: {
              LocationId: this.LocationId,
            },
          })

          break
      }
    },
  },
}
</script>

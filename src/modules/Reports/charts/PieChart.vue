<template>
  <v-layout column="">
    <v-card>
      <v-card-text>
        <slot name="header"></slot>
        <GChart
          type="PieChart"
          :data="chartData"
          :options="chartOptions"
        />
      </v-card-text>
    </v-card>
  </v-layout>
</template>
<script>
import { GChart } from 'vue-google-charts'

export default {
  name: 'reports-pie-chart',
  props: ['chartData'],
  components: {
    GChart,
  },
  created() {
    console.log(this.chartData)
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartOptions: {
      },
    }
  },
}
</script>

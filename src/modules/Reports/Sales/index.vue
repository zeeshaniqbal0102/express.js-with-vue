<template>
  <v-container>
    <h1>Sales</h1>
    <v-layout column>
      <v-layout row wrap>
        <!-- <v-btn>Today</v-btn>
        <v-btn>Yesterday</v-btn>
        <v-btn>Last Month</v-btn>
        <v-btn>Last Year</v-btn> -->
        <v-flex xs12>
          <v-dialog
            ref="startDateDialog"
            v-model="startDatePicker.dialog"
            :return-value.sync="startDatePicker.date"
            lazy
            width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="startDateFormatted"
              label="Start Date"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="startDatePicker.date" scrollable @input="$refs.startDateDialog.save(startDatePicker.date); loadSales()">
            </v-date-picker>
          </v-dialog>

          <v-dialog
            ref="endDateDialog"
            v-model="endDatePicker.dialog"
            :return-value.sync="endDatePicker.date"
            lazy
            width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="endDateFormatted"
              label="End Date"
              readonly
               clearable=""
            ></v-text-field>
            <v-date-picker v-model="endDatePicker.date" scrollable @input="$refs.endDateDialog.save(endDatePicker.date); loadSales()">
            </v-date-picker>
          </v-dialog>
        </v-flex>
        <v-flex xs12 sm6>
           <v-select
            v-model="selectedLocations"
            :items="locations"
            item-text="name"
            item-value="id"
            label="Select Location"
            placeholder="All Locations"
            multiple
            chips
            @input="loadSales"
            clearable
          >
          </v-select>
        </v-flex>

       <v-flex xs12 sm6>
          <v-select
            v-model="selectedEmployees"
            :items="employees"
            item-text="name"
            item-value="id"
            label="Select Employees"
            placeholder="All Employees"
            multiple
            chips
             @input="loadSales"
            clearable
          >
          </v-select>
       </v-flex>
      </v-layout>
      <!-- Revenue Charts -->
       <v-flex class="my-2">
          <h2>Organization Sales Summary </h2>
        </v-flex>
      <v-layout row wrap v-if="revenueChartData">
        <v-flex xs12 sm6>
          <PieChart :chartData="revenueChartData">
            <template slot="header">
              <v-layout column class="text-xs-center">
                <h3>Revenue Breakdown</h3>
                <h4>{{ salesData.revenue | currency }} </h4>
              </v-layout>
            </template>
          </PieChart>
        </v-flex>
        <v-flex xs12 sm6>
          <PieChart :chartData="salesChartData">
            <template slot="header">
              <v-layout column class="text-xs-center">
                <h3>Profit and Loss</h3>
                <h4>Total Sale: {{ salesData.netSales | currency }} </h4>
              </v-layout>
            </template>
          </PieChart>
        </v-flex>
      </v-layout>
      <!-- Revenue for entire Organization -->
      <v-layout column v-if="salesData">
        <v-layout row wrap>

          <v-flex xs12 sm6 class="pa-1">
            <v-card hover to="/invoice/list">
              <v-card-text> Revenue {{ salesData.revenue | currency }}
                <!-- <v-icon color="green" small>mdi-arrow-up-bold</v-icon> 40%  -->
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6  class="pa-1">
            <v-card hover>
              <v-card-text> Discounts {{ salesData.discounts | currency }} </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6  class="pa-1">
            <v-card hover>
              <v-card-text> Tax Collected {{ salesData.taxCollected | currency }} </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6  class="pa-1">
            <v-card hover>
              <v-card-text> Net Sales {{ salesData.netSales | currency }} </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6  class="pa-1">
            <v-card hover>
              <v-card-text> Estimated Costs {{ salesData.estimatedCost | currency }} </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6  class="pa-1">
            <v-card hover>
              <v-card-text> Estimated Profit {{ salesData.netProfit | currency }} </v-card-text>
            </v-card>
          </v-flex>

        </v-layout>
      </v-layout>

      <!-- Revenue by location -->
      <div v-if="salesData && salesData.locations.length > 0">
         <v-flex class="my-2 text-xs-center">
          <h2>By Location</h2>
        </v-flex>
        <div  v-for="location in salesData.locations" :key="location.id">
          <v-flex class="my-2">
            <h2>{{ location.name }}</h2>
          </v-flex>
           <v-layout row wrap>
            <v-flex xs12 sm6>
              <PieChart :chartData="[
              ['Label', 'Amount'],
              ['Sales', (parseFloat(location.netSales) > 0) ? parseFloat(location.netSales) : 0],
              ['Tax', (parseFloat(location.taxCollected) > 0) ? parseFloat(location.taxCollected) : 0],
              ['Discounts', (parseFloat(location.discounts) > 0) ? parseFloat(location.discounts) : 0]]
              ">
                <template slot="header">
                  <v-layout column class="text-xs-center">
                    <h3>Revenue Breakdown</h3>
                    <h4>{{ location.revenue | currency }} </h4>
                  </v-layout>
                </template>
              </PieChart>
            </v-flex>
            <!-- <v-flex xs12 sm6>
              <PieChart :chartData="[
              ['Label', 'Amount'],
              ['Cost', (parseFloat(location.estimatedCost) > 0) ? parseFloat(location.estimatedCost) : 0],
              ['Profit', (parseFloat(location.netProfit) > 0) ? parseFloat(location.netProfit) : 0]]
              ">
                <template slot="header">
                  <v-layout column class="text-xs-center">
                    <h3>Profit and Loss</h3>
                    <h4>Total Sale: {{ location.netSales | currency }} </h4>
                  </v-layout>
                </template>
              </PieChart>
            </v-flex> -->
          </v-layout>
        </div>

      </div>

      <!-- Revenue by Employee -->
      <v-layout row ></v-layout>
    </v-layout>
  </v-container>
</template>
<script>
import reportService from '../service.js'
import locationService from '../../Location/service.js'
import employeeService from '../../Employee/service.js'
import PieChart from '../charts/PieChart'

export default {
  name: 'reports-sales',
  components: {
    PieChart,
  },
  data() {
    return {
      startDatePicker: {
        dialog: false,
        date: this.$moment().startOf('day').utc().format('YYYY-MM-DD'),
      },
      endDatePicker: {
        dialog: false,
        date: null,
      },
      locations: [],
      selectedLocations: [],
      employees: [],
      selectedEmployees: [],
      salesData: null,
    }
  },
  async created() {
    this.loadSales()
    this.locations = (await locationService.getAll({ lite: true })).data
    this.employees = (await employeeService.getAll({ lite: true })).data
  },
  methods: {
    loadSales() {
      return reportService.Sales.get({
        start: (this.startDatePicker.date) ? this.$moment(this.startDatePicker.date).startOf('day').utc().toISOString() : null,
        end: (this.endDatePicker.date) ? this.$moment(this.endDatePicker.date).endOf('day').utc().toISOString() : null,
        locations: this.selectedLocations,
        employees: this.selectedEmployees,
      })
        .then((response) => {
          this.salesData = response.data
        })
    },
    generateLocationChartRevenueData(locationData) {
      if (this.locationData && this.locationData.revenue > 0) {
        const data = [['Label', 'Total']]
        data.push(['Sales', parseFloat(this.locationData.netSales)])
        data.push(['Discounts', parseFloat(this.locationData.discounts)])
        data.push(['Tax', parseFloat(this.locationData.taxCollected)])
        return data
      }
      return null
    },
  },
  computed: {
    revenueChartData() {
      if (this.salesData && this.salesData.revenue > 0) {
        // return [['Label', 'Total']].concat(Object.entries(this.salesData).map(([key, value]) => ([key, parseFloat(value)])))
        const data = [['Label', 'Total']]
        data.push(['Sales', parseFloat(this.salesData.netSales)])
        data.push(['Discounts', parseFloat(this.salesData.discounts)])
        data.push(['Tax', parseFloat(this.salesData.taxCollected)])
        return data
      }
      return null
    },
    salesChartData() {
      if (this.salesData && this.salesData.netSales > 0) {
        // return [['Label', 'Total']].concat(Object.entries(this.salesData).map(([key, value]) => ([key, parseFloat(value)])))
        const data = [['Label', 'Total']]
        data.push(['Cost', parseFloat(this.salesData.estimatedCost)])
        data.push(['Profit', parseFloat(this.salesData.netProfit)])
        return data
      }
      return null
    },
    startDateFormatted() {
      if (this.startDatePicker.date) {
        console.log(this.startDatePicker.date)
        return this.$moment(this.startDatePicker.date).format('MM/DD/YYYY')
      }
      return null
    },
    endDateFormatted: {
      get() {
        if (this.endDatePicker.date) {
          return this.$moment(this.endDatePicker.date).format('MM/DD/YYYY')
        }
        return null
      },
      set(val) {
        return this.endDatePicker.date = null
      },
    },
  },
}
</script>

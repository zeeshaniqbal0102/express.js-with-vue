<template>
  <v-container>
    <h1>TimeClock</h1>
      <v-layout row wrap>
        <v-flex xs12 sm6>
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
            <v-date-picker v-model="startDatePicker.date" scrollable @input="$refs.startDateDialog.save(startDatePicker.date); loadTimeClock()">
            </v-date-picker>
          </v-dialog>
        </v-flex>
        <v-flex xs12 sm6>
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
            <v-date-picker v-model="endDatePicker.date" scrollable @input="$refs.endDateDialog.save(endDatePicker.date); loadTimeClock()">
            </v-date-picker>
          </v-dialog>
        </v-flex>
        <v-flex xs12 sm5>
            <v-select
              v-model="selectedEmployeeId"
              :items="employees"
              item-text="name"
              item-value="id"
              label="Select Employees"
              placeholder="All Employees"
              @input="loadTimeClock"
              clearable
            >
            </v-select>
        </v-flex>
        <v-flex v-if="showLocationList" xs12 sm5>
           <v-select
            v-model="selectedLocations"
            :items="locations"
            item-text="name"
            item-value="id"
            label="Select Location"
            placeholder="All Locations"
            multiple
            chips
            @input="loadTimeClock"
            clearable
          >
          </v-select>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12>
          <v-card>
            <v-toolbar :color="$style.card.header" class="elevation-0">
              <v-toolbar-title>
                <v-layout row fill-height>
                  <span class="title">
                    {{ $t('pageHeader.totalHoursWorked') }} : {{ totalTime.dateString }}
                  </span>
                </v-layout>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="timeClockList"
                :loading="loading"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                      {{ props.item.clockInTime | moment('MM/DD/YYYY hh:mm A') }}
                  </td>
                  <td class="text-xs-left small-td">{{ props.item.clockOutTime | moment('MM/DD/YYYY hh:mm A') }}</td>
                  <td class="text-xs-left small-td">{{ (props.item.shiftDuration)?props.item.shiftDuration.dateString: 'N/A' }}</td>
                  <td class="text-xs-left small-td">{{ props.item.clockInNote }}</td>
                  <td class="text-xs-left small-td">{{ props.item.clockOutNote }}</td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import reportService from '../../service.js'
import locationService from '../../../Location/service.js'
import employeeService from '../../../Employee/service.js'

export default {
  name: 'reports-timeClock-list',
  data() {
    return {
      headers: [
        {
          text: this.$t('labels.clockIn'),
          value: 'clockInTime',
          sortable: true,
        },
        {
          text: this.$t('labels.clockOut'),
          value: 'clockOutTime',
          sortable: false
        },
        {
          text: this.$t('labels.workingHours'),
          value: 'shiftDuration',
          sortable: false
        },
        {
          text: this.$t('labels.clockInNote'),
          value: 'clockInNote',
          sortable: false
        },
        {
          text: this.$t('labels.clockOutNote'),
          value: 'clockOutNote',
          sortable: false
        }
      ],
      startDatePicker: {
        dialog: false,
        date: this.$moment().startOf('year').subtract(3, 'year').utc().format('YYYY-MM-DD'),
      },
      endDatePicker: {
        dialog: false,
        date: null,
      },
      loading: false,
      locations: [],
      selectedLocations: [],
      employees: [],
      selectedEmployeeId: null,
      showLocationList: true,
      timeClockList: [],
      totalTime: 0,
      count: 0,
    }
  },
  async created() {
    console.log('inside created: ', this.$route.params )
    this.selectedEmployeeId = this.$route.params.EmployeeId
    if (this.$route.params.LocationId) {
      this.showLocationList = false
      this.selectedLocations = [this.$route.params.LocationId]
    }
    this.loadTimeClock()
    this.locations = (await locationService.getAll({ lite: true })).data
    this.employees = (await employeeService.getAll({ lite: true })).data
  },
  methods: {
    loadTimeClock() {
			this.loading = true
      return reportService.TimeClock.get(this.selectedEmployeeId, {
        start: (this.startDatePicker.date) ? this.$moment(this.startDatePicker.date).startOf('day').utc().toISOString() : null,
        end: (this.endDatePicker.date) ? this.$moment(this.endDatePicker.date).endOf('day').utc().toISOString() : null,
        locations: this.selectedLocations
      })
        .then((response) => {
          this.timeClockList = response.data.timeClockList
          this.totalTime = response.data.totalTime
          this.count = this.timeClockList.length
          this.loading = false
        })
    },
  },
  computed: {
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

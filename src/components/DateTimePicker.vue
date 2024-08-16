<template>
  <div class="text-xs-right">
    <v-chip class="pa-2" color="grey lighten-2" v-model="customLabel" close>
      <v-avatar>
        <v-icon small>mdi-calendar-multiple-check</v-icon>
      </v-avatar>
      <span>{{ startDateDisplayNormal }}
        <template v-if="range">
          {{ $t('labels.to') }} {{ endDateDisplayNormal }}
        </template>
      </span>
    </v-chip>
    <template v-if="justCustomDate && !customLabel">
      <!-- <v-text-field
        solo
        hide-details
        v-model="startDateDisplayNormal"
        :label="`${range ? 'Start Date' : label ? label : 'Date'}`"
        readonly
        :clearable="clearable"
      ></v-text-field> -->
      <v-chip class="pa-2" @click="customBox" color="white">
        <v-avatar>
          <v-icon small>mdi-calendar-multiple-check</v-icon>
        </v-avatar>
        <span>pick a date</span>
      </v-chip>
    </template>
    <template v-else>
      <v-select
        v-if="!customLabel"
        hide-details
        item-text="name"
        :items="items"
        return-object
        v-model="selected"
        solo
        ref="selectDropdown"
      >
        <template slot="item" slot-scope="{ item }">
          <span>{{ item.name }}</span>
        </template>
        <template v-slot:append-item>
          <v-divider class="mt-2"></v-divider>
          <v-list-tile ripple @click="customBox">
            <v-list-tile-action>
              <v-icon>mdi-calendar-multiple-check</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('pageHeader.customDate') }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-select>
    </template>
    <v-dialog v-model="custom" width="500">
      <v-card :color="$style.card.background">
        <CardToolbar
          :title="$t('pageHeader.customDate')"
          :isModal="true"
          @cancel="cancel"
        />
        <v-container grid-list-lg>
          <v-layout row wrap justify-center align-center>
            <!-- START -->
            <v-flex shrink>
              <span>{{ $t('labels.from') }}</span>
              <v-menu
                ref="startMenu"
                v-model="startMenu"
                :close-on-content-click="false"
                :return-value.sync="startDateDisplay"
                lazy
                transition="scale-transition"
                offset-y
                full-width
              >
                <template slot="activator">
                  <v-text-field
                    solo
                    hide-details
                    v-model="startDateDisplayNormal"
                    :label="`${range ? 'Start Date' : label ? label : 'Date'}`"
                    readonly
                    :clearable="clearable"
                  ></v-text-field>
                </template>

                <v-date-picker
                  v-model="startDate"
                  scrollable
                  v-show="!start.selectTime"
                  :max="endDate"
                >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click.stop.prevent="startMenu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click.stop.prevent="start.selectTime = true"
                    v-if="!hideTime"
                    >Select Time</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click.stop.prevent="$refs.startMenu.save(startDateDisplay)"
                    v-else
                    >OK</v-btn
                  >
                </v-date-picker>

                <v-time-picker v-model="start.time" v-if="start.selectTime">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click.stop.prevent="startMenu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click.stop.prevent="$refs.startMenu.save(startDateDisplay)"
                    :disabled="!start.time"
                    >OK</v-btn
                  >
                </v-time-picker>
              </v-menu>
            </v-flex>

            <!-- END -->
            <v-flex shrink v-if="range">
              <span>{{ $t('labels.to') }}</span>
              <v-menu
                v-if="startDate"
                ref="endMenu"
                v-model="endMenu"
                :close-on-content-click="false"
                :return-value.sync="endDateDisplay"
                lazy
                transition="scale-transition"
                offset-y
                full-width
              >
                <template slot="activator">
                  <v-text-field
                    solo
                    hide-details
                    v-model="endDateDisplayNormal"
                    :label="`${endlabel ? endlabel : 'End Date'}`"
                    readonly
                    :clearable="clearable"
                  ></v-text-field>
                </template>

                <v-date-picker
                  v-model="endDate"
                  scrollable
                  v-show="!end.selectTime"
                  :min="startDate"
                  :max="noFuture ? $moment().format('YYYY-MM-DD') : null"
                >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click.stop.prevent="endMenu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click.stop.prevent="end.selectTime = true"
                    v-if="!hideTime"
                    >Select Time</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click.stop.prevent="$refs.endMenu.save(endDateDisplay)"
                    v-else
                    >OK</v-btn
                  >
                </v-date-picker>

                <v-time-picker v-model="end.time" v-if="end.selectTime">
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    color="primary"
                    @click.stop.prevent="
                      endMenu = false
                      end.selectTime = false
                    "
                    >Cancel</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click.stop.prevent="$refs.endMenu.save(endDateDisplay)"
                    :disabled="!end.time"
                    >OK</v-btn
                  >
                </v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" class="v-btn-with-radius" @click.stop.prevent="submitDate">
            {{ $t('buttons.go') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'date-time-picker',
  props: [
    'label',
    'endlabel',
    'range',
    'hideTime',
    'showIcon',
    'showEndIcon',
    'clearable',
    'initStartDate',
    'initEndDate',
    'noFuture',
    'autoSubmit',
    'defaultRange',
    'justCustomDate',
  ],
  data() {
    return {
      customLabel: false,
      custom: false,
      selected: 'Today',
      items: [
        {
          id: 'today',
          name: 'Today',
          start: this.$moment()
            .startOf('day')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'yesterday',
          name: 'Yesterday',
          start: this.$moment()
            .subtract(1, 'days')
            .startOf('days')
            .toISOString(),
          end: this.$moment()
            .subtract(1, 'days')
            .endOf('day')
            .toISOString(),
        },
        {
          id: "thisWeek",
          name: "This Week",
          start: this.$moment()
            .startOf("week")
            .toISOString(),
          end: this.$moment()
            .endOf("week")
            .toISOString()
        },
        {
          id: 'thisWeekToDate',
          name: 'This Week To Date',
          start: this.$moment()
            .startOf('week')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'lastWeek',
          name: 'Last Week',
          start: this.$moment()
            .subtract(1, 'weeks')
            .startOf('week')
            .toISOString(),
          end: this.$moment()
            .subtract(1, 'weeks')
            .endOf('week')
            .toISOString(),
        },
        {
          id: 'lastWeekToDate',
          name: 'Last Week To Date',
          start: this.$moment()
            .subtract(1, 'weeks')
            .startOf('week')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: "thisMonth",
          name: "This Month",
          start: this.$moment()
            .startOf("month")
            .toISOString(),
          end: this.$moment()
            .endOf("month")
            .toISOString()
        },
        {
          id: 'thisMonthToDate',
          name: 'This Month To Date',
          start: this.$moment()
            .startOf('month')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'lastMonth',
          name: 'Last Month',
          start: this.$moment()
            .subtract(1, 'month')
            .startOf('month')
            .toISOString(),
          end: this.$moment()
            .subtract(1, 'month')
            .endOf('month')
            .toISOString(),
        },
        {
          id: 'lastMonthToDate',
          name: 'Last Month To Date',
          start: this.$moment()
            .subtract(1, 'month')
            .startOf('month')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: "thisQuarter",
          name: "This Quarter",
          start: this.$moment()
            .startOf("quarter")
            .toISOString(),
          end: this.$moment()
            .endOf("quarter")
            .toISOString()
        },
        {
          id: 'thisQuarterToDate',
          name: 'This Quarter To Date',
          start: this.$moment()
            .startOf('quarter')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'lastQuarter',
          name: 'Last Quarter',
          start: this.$moment()
            .subtract(1, 'quarter')
            .startOf('quarter')
            .toISOString(),
          end: this.$moment()
            .subtract(1, 'quarter')
            .endOf('quarter')
            .toISOString(),
        },
        {
          id: 'lastQuarterToDate',
          name: 'Last Quarter To Date',
          start: this.$moment()
            .subtract(1, 'quarter')
            .startOf('quarter')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: "thisYear",
          name: "This Year",
          start: this.$moment()
            .startOf("year")
            .toISOString(),
          end: this.$moment()
            .endOf("year")
            .toISOString()
        },
        {
          id: 'thisYearToDate',
          name: 'This Year To Date',
          start: this.$moment()
            .startOf('year')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'thisYearToLastMonth',
          name: 'This Year To Last Month',
          start: this.$moment()
            .startOf('year')
            .toISOString(),
          end: this.$moment()
            .subtract(1, 'month')
            .endOf('month')
            .toISOString(),
        },       
        {
          id: 'lastYear',
          name: 'Last Year',
          start: this.$moment()
            .subtract(1, 'year')
            .startOf('year')
            .toISOString(),
          end: this.$moment()
            .subtract(1, 'year')
            .endOf('year')
            .toISOString(),
        },
        {
          id: 'lastYearToDate',
          name: 'Last Year To Date',
          start: this.$moment()
            .subtract(1, 'year')
            .startOf('year')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'since7DaysAgo',
          name: 'Since 7 Days Ago',
          start: this.$moment()
            .startOf('days')
            .subtract(7, 'days')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'since15DaysAgo',
          name: 'Since 15 Days Ago',
          start: this.$moment()
            .startOf('days')
            .subtract(15, 'days')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'since30DaysAgo',
          name: 'Since 30 Days Ago',
          start: this.$moment()
            .startOf('days')
            .subtract(30, 'days')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'since60DaysAgo',
          name: 'Since 60 Days Ago',
          start: this.$moment()
            .startOf('days')
            .subtract(60, 'days')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'since90DaysAgo',
          name: 'Since 90 Days Ago',
          start: this.$moment()
            .startOf('days')
            .subtract(90, 'days')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
        {
          id: 'since365DaysAgo',
          name: 'Since 365 Days Ago',
          start: this.$moment()
            .startOf('days')
            .subtract(365, 'days')
            .toISOString(),
          end: this.$moment()
            .endOf('day')
            .toISOString(),
        },
      ],
      startMenu: false,
      start: {
        date: null,
        time: null,
        selectTime: false,
      },
      endMenu: false,
      end: {
        date: null,
        time: null,
        selectTime: false,
      },
    }
  },
  created() {
    if (this.defaultRange) {
      const range = this.items.filter(element => element.id === this.defaultRange)
      if (range.length > 0) this.selected = range[0]
    }
    if (this.initStartDate) {
      this.start.date = this.initStartDate
      this.start.time = !this.hideTime
        ? this.$moment(this.initStartDate).format('HH:mm')
        : null
    }
    if (this.initEndDate) {
      this.end.date = this.initEndDate
      this.end.time = !this.hideTime
        ? this.$moment(this.initEndDate).format('HH:mm')
        : null
    }
  },
  computed: {
    startDate: {
      get() {
        return this.start.date ? `${this.start.date.format('YYYY-MM-DD')}` : null
      },
      set(val) {
        if (!val) return (this.start.date = null)
        this.start.date = new this.$moment(val)

        if (this.start.time) {
          const time = this.start.time.split(':')
          this.start.date.set({ hour: time[0], minute: time[1] })
        }
      },
    },
    endDate: {
      get() {
        return this.end.date ? `${this.end.date.format('YYYY-MM-DD')} ` : null
      },
      set(val) {
        if (!val) return (this.end.date = null)
        this.end.date = new this.$moment(val)

        if (this.end.time) {
          const time = this.end.time.split(':')
          this.end.date.set({ hour: time[0], minute: time[1] })
        }
      },
    },
    startDateDisplay: {
      get() {
        return this.start.date
          ? `${this.start.date.format('MM/DD/YYYY')} ${
              this.start.time ? this.start.time : ''
            }`
          : null
      },
      set(val) {
        if (val) {
          const newDate = new Date(val).toISOString()
          this.startDate = this.$moment(newDate).format('YYYY-MM-DD')
        } else {
          this.startDate = null
          this.start.time = null
        }
        this.submit()
      },
    },
    endDateDisplay: {
      get() {
        return this.end.date
          ? `${this.end.date.format('MM/DD/YYYY')} ${this.end.time ? this.end.time : ''}`
          : null
      },
      set(val) {
        if (val) {
          const newDate = new Date(val).toISOString()
          this.endDate = this.$moment(newDate).format('YYYY-MM-DD')
        } else {
          this.endDate = null
          this.end.time = null
        }
        this.submit()
      },
    },
    startDateDisplayNormal: {
      get() {
        return this.start.date
          ? `${this.start.date.format('MM/DD/YYYY')} ${
              this.start.time
                ? this.$moment(
                    `${this.start.date.format('YYYY-MM-DD')} ${this.start.time}`,
                  ).format('hh:mm a')
                : ''
            }`
          : null
      },
      set() {
        this.start.time = null
        this.start.date = null
        return this.submit()
      },
    },
    endDateDisplayNormal: {
      get() {
        return this.end.date
          ? `${this.end.date.format('MM/DD/YYYY')} ${
              this.end.time
                ? this.$moment(
                    `${this.end.date.format('YYYY-MM-DD')} ${this.end.time}`,
                  ).format('hh:mm a')
                : ''
            }`
          : null
      },
      set() {
        this.end.time = null
        this.end.date = null
        return this.submit()
      },
    },
  },
  methods: {
    submitDate() {
      this.$emit('submit')
      this.cancel()
      this.customLabel = true
    },
    cancel() {
      this.custom = !this.custom
    },
    customBox() {
      if (this.$refs.selectDropdown) {
        this.$refs.selectDropdown.blur()
      }

      this.custom = !this.custom
    },
    submit() {
      let date = null
      if (this.range) {
        date = {
          start: this.start.date
            ? this.start.time
              ? this.start.date.toISOString()
              : this.start.date.startOf('day').toISOString()
            : null,
          end: this.end.date
            ? this.end.time
              ? this.end.date.toISOString()
              : this.end.date.endOf('day').toISOString()
            : null,
        }
      } else if (this.start.date) {
        date = this.start.time
          ? this.start.date.toISOString()
          : this.start.date.startOf('day').toISOString()
      }
      this.start.selectTime = false
      this.end.selectTime = false
      if (date) this.$emit('input', date)
    },
  },
  watch: {
    selected: {
      handler(val) {
        this.startDate = val.start
        this.endDate = val.end
        this.submit()
        this.$emit('submit')
      },
      deep: true,
    },
    startDateDisplayNormal(val) {
      if (val === null) {
        this.end.date = null
        this.end.time = null
      }
    },
  },
}
</script>

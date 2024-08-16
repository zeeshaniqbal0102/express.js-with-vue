<template>
  <v-container fluid v-if="location" grid-list-lg>
    <TitleBar :title="location.name" />
    <v-layout column>
      <v-flex xs12>
        <v-card flat class="outlined" :color="$style.card.background">
          <CardToolbar :title="$t('pageHeader.location')" :isModal="false">
            <v-btn
              color="pink"
              dark
              round
              :href="`${terminalURL}/login/location?code=${location.code}`"
              target="_blank"
            >
              Open Terminal
            </v-btn>
          </CardToolbar>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 md6>
                <div class="font-weight-bold">{{ location.Address.addressLine1 }}</div>
                <div>{{ location.Address.addressLine2 }}</div>
                <div>{{ location.Address.city }}</div>
                <div>{{ location.Address.State.name }}</div>
                <div>{{ location.Address.postalCode }}</div>
                <div>{{ location.Address.phoneNumber }}</div>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex shrink>
                <v-layout column>
                  <v-flex>
                    <DateTimePicker
                      :range="true"
                      v-model="dateTime"
                      :initStartDate="start"
                      :initEndDate="end"
                      @submit="getLocationSales()"
                    />
                  </v-flex>
                  <v-flex>
                    <div class="text-xs-right">
                      From:
                      <span class="font-weight-medium">{{
                        dateTime.start | moment('LLLL')
                      }}</span>
                    </div>
                    <div class="text-xs-right">
                      To:
                      <span class="font-weight-medium">{{
                        dateTime.end | moment('LLLL')
                      }}</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <SaleBaseTile ref="saleBaseTile" :dateTime="dateTime" :id="location.id"/>
          </v-card-text>
          
          <!-- <v-container grid-list-md fluid>
            <v-layout row wrap v-if="Reports.Sales">
              <v-flex md4 xs12>
                <v-card class="outlined" flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex class="title font-weight-bold">{{
                        $t('labels.income')
                      }}</v-flex>
                      <v-flex>
                        <v-layout row wrap align-center>
                          <v-flex>
                            <img src="@/assets/icons/coins.png" height="64px" />
                          </v-flex>
                          <v-flex shrink>
                            <v-progress-circular
                              :size="50"
                              v-if="isLoading"
                              :width="7"
                              color="info"
                              indeterminate
                            ></v-progress-circular>
                            <div v-else class="display-2 text-xs-right font-weight-light">
                              {{ Reports.Sales.Goods.Income.total | currency }}
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex md4 xs12 d-flex>
                <v-card class="outlined" flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex class="title font-weight-bold">{{
                        $t('labels.costOfGoods')
                      }}</v-flex>
                      <v-flex>
                        <v-layout row wrap align-center>
                          <v-flex>
                            <img src="@/assets/icons/budget.png" height="64px" />
                          </v-flex>
                          <v-flex shrink>
                            <v-progress-circular
                              :size="50"
                              v-if="isLoading"
                              :width="7"
                              color="info"
                              indeterminate
                            ></v-progress-circular>
                            <div v-else class="display-2 text-xs-right font-weight-light">
                              {{ Reports.Sales.Goods.CostOfGoods.total | currency }}
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex md4 xs12>
                <v-card class="outlined" flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex class="title font-weight-bold">{{
                        $t('labels.grossProfit')
                      }}</v-flex>
                      <v-flex>
                        <v-layout row wrap align-center>
                          <v-flex>
                            <img src="@/assets/icons/money.png" height="64px" />
                          </v-flex>
                          <v-flex shrink>
                            <v-progress-circular
                              :size="50"
                              v-if="isLoading"
                              :width="7"
                              color="info"
                              indeterminate
                            ></v-progress-circular>
                            <div v-else class="display-2 text-xs-right font-weight-light">
                              {{ Reports.Sales.Goods.GrossProfit | currency }}
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex md4 xs12 d-flex>
                <v-card class="outlined" flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex class="title font-weight-bold">{{
                        $t('labels.expenses')
                      }}</v-flex>
                      <v-flex>
                        <v-layout row wrap align-center>
                          <v-flex>
                            <img src="@/assets/icons/expense.png" height="64px" />
                          </v-flex>
                          <v-flex shrink>
                            <v-progress-circular
                              :size="50"
                              v-if="isLoading"
                              :width="7"
                              color="info"
                              indeterminate
                            ></v-progress-circular>
                            <div v-else class="display-2 text-xs-right font-weight-light">
                              {{ Reports.Sales.Expense.total | currency }}
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex md4 xs12>
                <v-card class="outlined" flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex class="title font-weight-bold">{{
                        $t('labels.cash')
                      }}</v-flex>
                      <v-flex>
                        <v-layout row wrap align-center>
                          <v-flex>
                            <img src="@/assets/icons/cash.png" height="64px" />
                          </v-flex>
                          <v-flex shrink>
                            <v-progress-circular
                              :size="50"
                              v-if="isLoading"
                              :width="7"
                              color="info"
                              indeterminate
                            ></v-progress-circular>
                            <div v-else class="display-2 text-xs-right font-weight-light">
                              {{ Reports.Sales.cash.total | currency }}
                            </div>
                            <small class="text-xs-right">Total Cash Sale</small>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex md4 xs12>
                <v-card class="outlined" flat>
                  <v-card-text>
                    <v-layout column>
                      <v-flex class="title font-weight-bold">{{
                        $t('labels.cashInHand')
                      }}</v-flex>
                      <v-flex>
                        <v-layout row wrap align-center>
                          <v-flex>
                            <img src="@/assets/icons/cashInHand.png" height="64px" />
                          </v-flex>
                          <v-flex shrink>
                            <v-progress-circular
                              :size="50"
                              v-if="isLoading"
                              :width="7"
                              color="info"
                              indeterminate
                            ></v-progress-circular>
                            <div v-else class="display-2 text-xs-right font-weight-light">
                              {{ cashInHand | currency }}
                            </div>
                            <small class="text-xs-right"
                              >Cash balance after expense</small
                            >
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container> -->
        </v-card>
      </v-flex>

      <v-expansion-panel>
        <!-- <v-expansion-panel-content>
          <div slot="header">Sales Today</div>
          <v-card flat class="cardTitle" :color="$style.card.background">
            <v-card-text>
              <v-layout row wrap>
                <v-spacer></v-spacer>
                <v-flex shrink>
                  <DateTimePicker
                    :range="true"
                    v-model="dateTime"
                    :initStartDate="start"
                    :initEndDate="end"
                    @submit="getLocationSales()"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card>
            <v-layout wrap>
              <v-flex class="pa-1" xs12 md6>
                <v-card class="text-xs-center" hover>
                  <v-card-text class="display-1 mb-2" v-if="Reports.Sales">
                    Income <br />
                    {{ Reports.Sales.Goods.Income.total | currency }}
                  </v-card-text>
                  {{ $moment().format('MM/DD/YY h:mm a') }}
                </v-card>
              </v-flex>
              <v-flex class="pa-1" xs12 md6>
                <v-card class="text-xs-center" hover>
                  <v-card-text class="display-1 mb-2" v-if="Reports.Sales">
                    Cost of Goods <br />
                    {{ Reports.Sales.Goods.CostOfGoods.total | currency }}
                  </v-card-text>
                  {{ $moment().format('MM/DD/YY h:mm a') }}
                </v-card>
              </v-flex>
              <v-flex class="pa-1" xs12 md6>
                <v-card class="text-xs-center" hover>
                  <v-card-text class="display-1 mb-2" v-if="Reports.Sales">
                    Gross Profit <br />
                    {{ Reports.Sales.Goods.GrossProfit | currency }}
                  </v-card-text>
                  {{ $moment().format('MM/DD/YY h:mm a') }}
                </v-card>
              </v-flex>
              <v-flex class="pa-1" xs12 md6>
                <v-card class="text-xs-center" hover>
                  <v-card-text class="display-1 mb-2" v-if="Reports.Sales">
                    Expenses <br />
                    {{ Reports.Sales.Expense.total | currency }}
                  </v-card-text>
                  {{ $moment().format('MM/DD/YY h:mm a') }}
                </v-card>
              </v-flex>
              <v-flex class="pa-1" xs12 md6>
                <v-card class="text-xs-center" hover>
                  <v-card-text
                    class="display-1 mb-2"
                    v-if="Reports.Sales && Reports.Sales.cash"
                  >
                    Cash <br />
                    {{ Reports.Sales.cash.total | currency }}
                  </v-card-text>
                  {{ $moment().format('MM/DD/YY h:mm a') }}
                </v-card>
              </v-flex>
              <v-flex class="pa-1" xs12 md6>
                <v-card class="text-xs-center" hover>
                  <v-card-text
                    class="display-1 mb-2"
                    v-if="Reports.Sales && Reports.Sales.cash"
                  >
                    Cash In Hand <br />
                    {{ cashInHand | currency }}
                  </v-card-text>
                  {{ $moment().format('MM/DD/YY h:mm a') }}
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>
        </v-expansion-panel-content> -->
        <v-expansion-panel-content>
          <div slot="header">Subscription</div>
          <v-card lazy v-if="subscription">
            <v-layout row wrap>
              <update-plan
                :location="location"
                v-on:updated="loadSubscription"
              ></update-plan>
              <update-payment-button
                :locationId="this.location.id"
                :defaultCardId="subscription.default_source"
                v-on:update="loadSubscription"
              ></update-payment-button>
            </v-layout>

            <v-card-text>
              <div v-if="subscription.plan">
                Plan: {{ subscription.plan.name }} <br />
                Amount: {{ (subscription.plan.amount / 100) | currency }} <br />
                Interval: {{ subscription.plan.interval }} <br />
              </div>
              <div v-else-if="subscription.items.count > 1">
                Active Plans
                <div v-for="item in subscription.items.data" :key="item.id" class="ma-2">
                  Plan: {{ item.plan.name }} <br />
                  Amount: {{ (item.plan.amount / 100) | currency }} <br />
                  Interval: {{ item.plan.interval }} <br />
                </div>
              </div>
              Subscribed Since:
              {{ $moment.unix(subscription.start_date).format('MM/DD/YY') }} <br />
              Status: {{ subscription.status }} <br />
              Renewal:
              {{
                `${
                  subscription.billing === 'charge_automatically'
                    ? 'Auto-charge'
                    : 'Manual'
                }`
              }}
              <br />
              Current Billing Cycle:
              {{ $moment.unix(subscription.current_period_start).format('MM/DD/YY') }} -
              {{ $moment.unix(subscription.current_period_end).format('MM/DD/YY') }}
              <br />
              <span v-if="subscription.trial_end"
                >Trial Ends:
                {{ $moment.unix(subscription.trial_end).format('MM/DD/YY') }} <br
              /></span>
            </v-card-text>
          </v-card>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
            v-else
          ></v-progress-linear>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Employees</div>
          <v-card>
            <EmployeeList
              :LocationId="location.id"
              :hideHeader="true"
              :hideCreate="true"
            ></EmployeeList>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Settings</div>
          <v-card>
            <Settings :LocationId="location.id"></Settings>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Notifications</div>
          <v-card>
            <Notifications :LocationId="location.id" :location="location"></Notifications>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Reports</div>
          <v-card>
            <Reports :LocationId="location.id" :location="location"></Reports>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="getLocationIntegration">
          <div slot="header">Expense</div>
          <v-card>
            <Expense
              :locationIntegration="locationIntegration"
              :LocationId="location.id"
              :location="location"
            ></Expense>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import locationService from '@/modules/Location/service.js'
import UpdatePaymentButton from '../components/UpdatePayment'
import UpdatePlan from '../components/UpdatePlan'
import EmployeeList from '../../Employee/components/List'
import Settings from '../components/Settings'
import Reports from '../components/Reports'
import Expense from '../components/Expense'
import Notifications from '../components/Notifications'
import DateTimePicker from '@/components/DateTimePicker'
import SaleBaseTile from '@/modules/Location/components/SaleBase.vue'

export default {
  name: 'location-view-profile',
  components: {
    UpdatePaymentButton,
    UpdatePlan,
    EmployeeList,
    Settings,
    Reports,
    SaleBaseTile,
    Notifications,
    Expense,
    DateTimePicker,
  },
  data() {
    return {
      start: this.$moment().startOf('day'),
      end: this.$moment().endOf('day'),
      dateTime: {
        start: this.$moment()
          .startOf('day')
          .toISOString(),
        end: this.$moment()
          .endOf('day')
          .toISOString(),
      },
      terminalURL: process.env.VUE_APP_TERMINALURL,
      location: null,
      Reports: {
        Sales: null,
      },
      subscription: null,
      isLoading: true,
      locationIntegration: false,
    }
  },
  async created() {
    await this.loadLocation()
    this.getTerminalExpense()
    this.$Progress.start()
    this.getLocationSales()

    this.loadSubscription()
  },
  computed: {
    getLocationIntegration() {
      return this.locationIntegration
    },
    cashInHand() {
      return this.Reports.Sales.cash.total - this.Reports.Sales.Expense.total
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
        return (this.endDatePicker.date = null)
      },
    },
    ...mapGetters('integration', ['locationModules']),
  },
  methods: {
    getLocationSales() {
      this.isLoading = true
      this.$Progress.start()
      locationService.Reports.getLocationSales({
        start: this.dateTime.start,
        end: this.dateTime.end,
        // today: true,
        LocationId: this.location.id,
      }).then(response => {
        this.$Progress.finish()
        this.Reports.Sales = response.data.report
        this.isLoading = false
      })
    },
    async getTerminalExpense() {
      locationService
        .getIntegrationByLocation(this.location.id, {
          module: 'terminalExpense',
        })
        .then(locationIntegration => {
          if (locationIntegration.data[0]) {
            this.locationIntegration = locationIntegration.data[0]
          }
        })
    },

    loadLocation() {
      if (!this.$route.params || !this.$route.params.id)
        return this.$router.push('/location')
      const { id } = this.$route.params
      this.$Progress.start()
      return locationService
        .getbyId(id)
        .then(response => {
          this.$Progress.finish()
          this.isLoading = false
          this.location = response.data
        })
        .catch(error => {
          this.$router.push('/location')
        })
    },
    loadSubscription() {
      return locationService.Billing.getSubscription(this.location.id)
        .then(response => {
          console.log('sub', response.data)
          this.subscription = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
}
</script>

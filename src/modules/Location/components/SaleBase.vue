<template>
  <div>
    <v-layout column>
      <v-flex>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/invoiceCount.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.invoiceCount') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ InvoiceCount }} </span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/customerCount.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.customerCount') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ customerCount }}</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/revenue.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.revenue') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ Revenue | currency }}</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/income.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.income') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ income | currency }}</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/cash.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.cash') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ cashAmount | currency }}</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/card.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.card') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ cardAmount | currency }}</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/checkBook.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.otherPayments') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ otherPayment | currency }}</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/expense.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.expense') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ expense | currency }}</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="@/assets/icons/home/cashInHand.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('labels.cashInHand') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="isLoading"></v-progress-circular>
              <span class="text-xs-right" v-else>{{ cashInHand | currency }}</span>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex sm4>
        <v-card color="#5E98CA" flat dark>
          <v-card-text>
            <v-layout column>
              <v-flex class="title font-weight-bold">{{ $t('labels.netProfit') }}</v-flex>
              <v-flex>
                <v-layout row wrap align-center>
                  <v-flex>
                    <img src="@/assets/icons/home/profitandlost.png" height="64px" />
                  </v-flex>
                  <v-flex shrink v-if="isLoading">
                    <v-progress-circular indeterminate></v-progress-circular>
                  </v-flex>

                  <v-flex shrink v-else>
                    <div
                      class="display-3 text-xs-right font-weight-light"
                    >
                      {{ NetProfit | currency }}
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm4>
        <v-card color="#756493" flat dark>
          <v-card-text>
            <v-layout column>
              <v-flex class="title font-weight-bold">{{ $t('labels.taxCollected') }}</v-flex>
              <v-flex>
                <v-layout row wrap align-center>
                  <v-flex>
                    <img src="@/assets/icons/home/netSale.png" height="64px" />
                  </v-flex>
                  <v-flex shrink v-if="isLoading">
                    <v-progress-circular indeterminate></v-progress-circular>
                  </v-flex>
                  <v-flex shrink v-else>
                    <div
                      class="display-3 text-xs-right font-weight-light"
                    >
                      {{ TaxCollected | currency }}
                    </div>
                    
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm4>
        <v-card color="#63547b" flat dark>
          <v-card-text>
            <v-layout column>
              <v-flex class="title font-weight-bold">{{ $t('labels.discounts') }}</v-flex>
              <v-flex>
                <v-layout row wrap align-center>
                  <v-flex>
                    <img src="@/assets/icons/home/discount.png" height="64px" />
                  </v-flex>
                  <v-flex shrink v-if="isLoading">
                    <v-progress-circular indeterminate></v-progress-circular>
                  </v-flex>
                  <v-flex shrink v-else>
                    <div                     
                      class="display-3 text-xs-right font-weight-light"
                    >
                      {{ Discounts | currency }}
                    </div>
                   
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
        </v-layout>
      </v-flex>
      
    </v-layout>
  </div>
</template>

<script>
import locationService from '@/modules/Location/service.js'

export default {
  props: ['dateTime', 'id'],
  data() {
    return {
      isLoading: true,
      Revenue: 0,
      Discounts: 0,
      InvoiceCount: 0,
      customerCount: 0,
      NetSales: 0,
      expense: 0,
      NetProfit: 0,
      income: 0,
      TaxCollected: 0,
      cashAmount: 0,
      cardAmount: 0,
      otherPayment: 0,
      cashInHand: 0,
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    dateTime() {
      this.loadData()
    },
  },
  methods: {
    loadData() {
      this.isLoading = true
       locationService.Reports.getLocationSales({
        start: this.dateTime.start,
        end: this.dateTime.end,
        // today: true,
        LocationId: this.id,
      })
        .then(response => {
          this.Revenue = parseFloat(response.data.revenue);
          this.InvoiceCount = response.data.invoiceCount;
          this.Discounts = parseFloat(response.data.discounts);
          this.NetSales = parseFloat(response.data.netSales);
          this.NetProfit = parseFloat(response.data.netProfit);
          this.TaxCollected = parseFloat(response.data.taxCollected);
          this.cashAmount = parseFloat(response.data.cashAmount);
          this.otherPayment = parseFloat(response.data.otherPaymentAmount);
          this.customerCount = parseFloat(response.data.customerCount);
          this.expense = parseFloat(response.data.expense);     
          this.cardAmount = parseFloat(response.data.creditCardAmount) + parseFloat(response.data.debitCardAmount);
          this.income = this.otherPayment + this.cashAmount + this.cardAmount
          this.cashInHand = parseFloat(this.cashAmount) - parseFloat(this.expense)
          this.isLoading = false
        })
        .catch(error => {
          this.isLoading = false
          console.log(error);
        });
      // reportService
      //   .getTopSellingItems({
      //     start: this.start,
      //     end: this.$moment(this.start)
      //       .endOf('day')
      //       .toISOString(),
      //   })
      //   .then(response => {
      //     this.TopSelling = response.data;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
      // reportService
      //   .getSaleByCustomer({
      //     start: this.start,
      //     end: this.$moment(this.start)
      //       .endOf('day')
      //       .toISOString(),
      //   })
      //   .then(response => {
      //     this.TopCustomers = response.data;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // if (this.$refs.averageSpending) this.$refs.averageSpending.loadData();
    },
    nFormatter(num, digits) {
      var si = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
      ];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
    },
  },
};
</script>

<style scoped></style>

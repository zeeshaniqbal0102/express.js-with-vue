<template>
  <div class="invoice-view">
    <Loading :loading="isLoading"></Loading>
    <v-card flat v-if="report">
      <ReportViewBar
        title="Sale Summary"
        :start="start"
        :end="end"
        :location="report.location"
      />

      <v-container grid-list-md fluid>
        <v-layout column>
          <v-flex>
            <h3>Sale Summary</h3>
            <v-card class="outlined mt-2" flat>
              <v-card-text>
                <v-layout column>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex>
                        Total Revenue
                      </v-flex>
                      <v-flex class="text-xs-right">
                        {{ report.saleSummary.revenue | currency }}
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-divider></v-divider>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex>
                        Discount
                      </v-flex>
                      <v-flex class="text-xs-right">
                        {{ report.saleSummary.discounts | currency }}
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-divider></v-divider>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex>
                        Tax Collected
                      </v-flex>
                      <v-flex class="text-xs-right">
                        {{ report.saleSummary.taxCollected | currency }}
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-divider></v-divider>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex>
                        Net Sales
                      </v-flex>
                      <v-flex class="text-xs-right">
                        {{ report.saleSummary.netSales | currency }}
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-divider></v-divider>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex class="text-xs-right mr-3 font-weight-medium">
                        Total
                      </v-flex>
                      <v-flex class="text-xs-right font-weight-medium" shrink>
                        {{ report.saleSummary.netSales | currency }}
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-if="report && report.saleByCategory">
            <h3>Sale By Category</h3>
            <v-card class="outlined mt-2" flat>
              <v-card-text>
                <v-layout column>
                  <div v-for="(row, index) in report.saleByCategory">
                    <v-flex :index="index">
                      <v-layout row wrap>
                        <v-flex>
                          <span v-if="row.name">{{ row.name }}</span>
                          <span v-else>Uncategorized</span>
                        </v-flex>
                        <v-flex class="text-xs-right">
                          {{ report.saleSummary.revenue | currency }}
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-divider></v-divider>
                  </div>
                  <v-flex>
                    <v-layout row wrap>
                      <v-flex class="text-xs-right mr-3 font-weight-medium">
                        Total
                      </v-flex>
                      <v-flex class="text-xs-right font-weight-medium" shrink>
                        {{ report.saleSummary.netSales | currency }}
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex v-for="(masterCategory, index) in report.profitAndLoss.report.Goods.Income.data" :key="index">
            <h3 v-for="subCategory in masterCategory" >{{ masterCategory }}</h3>
          
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import reportService from '@/modules/ReportView/service.js'
import Loading from '@/components/LoadingDialog.vue'
import ReportViewBar from '@/components/ReportViewBar.vue'
const { validationMixin } = require('vuelidate')
const { email } = require('vuelidate/lib/validators')

export default {
  name: 'report-location-day-summary',
  props: ['LocationId', 'dateTime'],
  data() {
    return {
      isLoading: false,
      report: null,
      start: null,
      end: null,
      doc: {
        info: {
          title: 'Day Summary',
        },
        footer(currentPage, pageCount) {
          return {
            margin: 10,
            columns: [
              {
                fontSize: 9,
                text: [
                  {
                    text:
                      '--------------------------------------------------------------------------' +
                      '\n',
                    margin: [0, 20],
                  },
                  {
                    text: `Day Summary Page ${currentPage.toString()} of ${pageCount}`,
                  },
                ],
                alignment: 'center',
              },
            ],
          }
        },
        content: [],
        styles: {
          heading: {
            alignment: 'center',
            fontSize: 10,
          },
          currency: {
            alignment: 'right',
          },
          quantity: {
            alignment: 'center',
          },
          topDetails: {
            margin: [0, 0],
            fontSize: 8,
          },
        },
      },
      currentPage: 1,
      pages: 0,
      emailInvoice: {
        dialog: false,
        email: '',
      },
    }
  },
  components: {
    Loading,
    ReportViewBar,
  },
  computed: {
    ...mapGetters('settings', ['embedPDF']),
    emailErrors() {
      const errors = []
      if (!this.$v.emailInvoice.email.$dirty) return errors
      if (!this.$v.emailInvoice.email.email)
        errors.push(this.$t('validations.emailIsNotValid'))
      return errors
    },
  },
  async created() {
    await this.loadReport()
  },
  methods: {
    setPages(val) {
      this.pages = val
    },
    async loadReport() {
      if (!this.$route.params || !this.$route.params.id) {
        return this.$router.push('/location')
      }
      const { id } = this.$route.params
      this.start = this.$route.query.start
      this.end = this.$route.query.end
      this.$Progress.start()
      this.isLoading = true
      try {
        this.report = (
          await reportService.Location.daySummary({
            LocationId: id,
            start: this.start,
            end: this.end,
          })
        ).data
        this.doc.pageSize = 'Letter'
        this.doc.info.title += ` ${this.report.location.name}`

        // Top Heading
        this.doc.content.push({
          columns: [
            {
              stack: [
                { text: this.report.location.name, fontSize: 13, bold: true },
                this.report.location.Address.addressLine1,
                this.report.location.Address.addressLine2,
                `${this.report.location.Address.city}, ${this.report.location.Address.State.name} ${this.report.location.Address.postalCode}`,
                this.report.location.Address.phoneNumber,
              ],
              fontSize: 8,
            },
            {
              stack: [
                {
                  text: 'Day Summary',
                  alignment: 'right',
                  fontSize: 13,
                  marging: [0, 10],
                },
                {
                  text: `From: ${this.$moment(this.start).format('MM/DD/YY hh:mm a')}`,
                  alignment: 'right',
                  fontSize: 8,
                  marging: [0, 10],
                },
                {
                  text: `To: ${this.$moment(this.end).format('MM/DD/YY hh:mm a')}`,
                  alignment: 'right',
                  fontSize: 8,
                  marging: [0, 10],
                },
                {
                  text: `Time Zone: ${this.$moment.tz.guess()}`,
                  alignment: 'right',
                  fontSize: 8,
                  marging: [0, 10],
                },
                {
                  text: `Generated: ${this.$moment().format('MM/DD/YY hh:mm a')}`,
                  alignment: 'right',
                  fontSize: 8,
                  marging: [0, 10],
                },
              ],
            },
          ],
        })

        // Summary
        this.doc.content.push({
          stack: [
            { text: 'Summary', margin: [0, 10, 0, 5] },
            {
              table: {
                widths: ['*', 'auto'],
                body: [
                  [
                    { text: 'Total Revenue' },
                    {
                      text: this.$options.filters.currency(
                        this.report.saleSummary.revenue,
                      ),
                      style: ['currency'],
                    },
                  ],
                  [
                    { text: 'Discounts' },
                    {
                      text: this.$options.filters.currency(
                        this.report.saleSummary.discounts,
                      ),
                      style: ['currency'],
                    },
                  ],
                  [
                    { text: 'Tax Collected' },
                    {
                      text: this.$options.filters.currency(
                        this.report.saleSummary.taxCollected,
                      ),
                      style: ['currency'],
                    },
                  ],
                  [
                    { text: 'Net Sales' },
                    {
                      text: this.$options.filters.currency(
                        this.report.saleSummary.netSales,
                      ),
                      style: ['currency'],
                    },
                  ],
                ],
              },
            },
          ],
          margin: [0, 10, 0, 0],
        })

        // Sale  by Category
        if (this.report.saleByCategory) {
          const saleByCategoryHeaders = [
            [{ text: 'Name', colSpan: 2 }, '', 'QTY', 'Total'],
          ]

          let categoryQuantityTotal = 0
          let categoryAmountTotal = 0
          const saleByCategoryBody = await Promise.all(
            this.report.saleByCategory.map(category => {
              categoryQuantityTotal += parseInt(category.quantity)
              categoryAmountTotal += parseFloat(category.total)
              return [
                { text: category.name || 'Uncategorized', colSpan: 2 },
                '',
                { text: parseFloat(category.quantity).toFixed(), style: ['quantity'] },
                {
                  text: this.$options.filters.currency(category.total),
                  style: ['currency'],
                },
              ]
            }),
          )
          const saleByCategoryFooter = [
            [
              { border: [false, false, false, false], text: '' },
              { text: 'Total', alignment: 'left' },
              { text: categoryQuantityTotal, alignment: 'center' },
              {
                text: this.$options.filters.currency(categoryAmountTotal),
                alignment: 'right',
              },
            ],
          ]
          this.doc.content.push({
            stack: [
              { text: 'Sale By Category', margin: [0, 10, 0, 5] },
              {
                table: {
                  widths: ['*', 'auto', 'auto', 'auto'],
                  body: saleByCategoryHeaders
                    .concat(saleByCategoryBody)
                    .concat(saleByCategoryFooter),
                },
              },
            ],
            margin: [0, 10, 0, 0],
          })
        }

        if (this.report.profitAndLoss) {
          const pl = this.report.profitAndLoss.report
          // Object comes prepared from backend
          this.doc.content.push({
            text: 'Sale Detail',
            alignment: 'center',
            fontSize: '16',
            margin: [0, 10, 0, 0],
          })

          console.log(pl.Goods.Income.total)
          // this.doc.content.push({
          //   columns: [
          //     { text: 'Income' },
          //     { text: this.$options.filters.currency(pl.Goods.Income.total) },
          //   ],
          //   margin: [0, 0, 0, 0],
          // })
          // this.doc.content.push({
          //   columns: [
          //     { text: 'Cost' },
          //     { text: this.$options.filters.currency(pl.Goods.CostOfGoods.total) },
          //   ],
          // })
          // this.doc.content.push({
          //   columns: [
          //     { text: 'Gross Profit' },
          //     { text: this.$options.filters.currency(pl.Goods.GrossProfit) },
          //   ],
          // })

          await Promise.all(
            Object.keys(pl.Goods.Income.data).map(async masterCategory => {
              const masterCategoryData = pl.Goods.Income.data[masterCategory]
              const masterCategoryCostData = pl.Goods.CostOfGoods.data[masterCategory]
              let masterCategoryBody = [
                [{ text: 'Name', colSpan: 2 }, '', 'Qty', 'Cost', 'Sale'],
              ]
              const masterCategoryFooter = [[]]

              await Promise.all(
                Object.keys(masterCategoryData.data).map(async subCategory => {
                  const subCategoryData = masterCategoryData.data[subCategory]
                  const subCategoryCostData = masterCategoryCostData.data[subCategory]

                  if (Object.keys(subCategoryData.data).length > 0) {
                    const subCategoryHeaders = [
                      [{ text: 'Product Name', colSpan: 2 }, '', 'Qty', 'Cost', 'Sale'],
                    ]
                    const subCategoryBody = await Promise.all(
                      Object.keys(subCategoryData.data).map(lineItem => {
                        const lineItemData = subCategoryData.data[lineItem]
                        const lineItemCostData = subCategoryCostData.data[lineItem]
                        return [
                          { text: lineItem, colSpan: 2 },
                          '',
                          { text: lineItemData.quantity, alignment: 'center' },
                          {
                            text: this.$options.filters.currency(lineItemCostData.total),
                            alignment: 'right',
                          },
                          {
                            text: this.$options.filters.currency(lineItemData.total),
                            alignment: 'right',
                          },
                        ]
                      }),
                    )
                    const subCategoryFooter = [
                      [
                        { border: [false, false, false, false], text: '' },
                        { text: 'Total', alignment: 'left' },
                        { text: subCategoryData.quantity, alignment: 'center' },
                        {
                          text: this.$options.filters.currency(subCategoryCostData.total),
                          alignment: 'right',
                        },
                        {
                          text: this.$options.filters.currency(subCategoryData.total),
                          alignment: 'right',
                        },
                      ],
                    ]
                    this.doc.content.push({
                      stack: [
                        { text: subCategory, margin: [0, 10, 0, 5] },
                        {
                          table: {
                            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                            body: subCategoryHeaders
                              .concat(subCategoryBody)
                              .concat(subCategoryFooter),
                          },
                        },
                      ],
                      margin: [0, 10, 0, 0],
                    })
                  } else {
                    masterCategoryBody = masterCategoryBody.concat([
                      [
                        { text: subCategory, colSpan: 2 },
                        '',
                        { text: subCategoryData.quantity, alignment: 'center' },
                        {
                          text: this.$options.filters.currency(subCategoryCostData.total),
                          alignment: 'right',
                        },
                        {
                          text: this.$options.filters.currency(subCategoryData.total),
                          alignment: 'right',
                        },
                      ],
                    ])
                  }
                }),
              )
              if (masterCategoryBody.length > 1) {
                this.doc.content.push({
                  stack: [
                    { text: masterCategory, margin: [0, 10, 0, 5] },
                    {
                      table: {
                        widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                        body: masterCategoryBody.concat([
                          [
                            { border: [false, false, false, false], text: '' },
                            { text: 'Total', alignment: 'left' },
                            { text: masterCategoryData.quantity, alignment: 'center' },
                            {
                              text: this.$options.filters.currency(
                                masterCategoryCostData.total,
                              ),
                              alignment: 'right',
                            },
                            {
                              text: this.$options.filters.currency(
                                masterCategoryData.total,
                              ),
                              alignment: 'right',
                            },
                          ],
                        ]),
                      },
                    },
                  ],
                  margin: [0, 5, 0, 0],
                })
              }
            }),
          )
        }

        /** Finally we take the doc and convert it into data for it to be displayed by the viewer */
        pdfMake.createPdf(this.doc).getDataUrl(data => {
          this.pdf = data
        })
        this.isLoading = false
        this.$Progress.finish()
      } catch (error) {
        this.isLoading = false
        this.$Progress.fail()
        console.log(error)
      }
    },
  },
  mixins: [validationMixin],
  validations: {
    emailInvoice: {
      email: {
        email,
      },
    },
  },
}
</script>

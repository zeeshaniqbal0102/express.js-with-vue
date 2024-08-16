<template>
  <v-layout fill-height column="">
    <!-- <h3  class="text-xs-center ma-2">Day Summary</h3> -->
    <Loading :loading="isLoading"></Loading>
    <!-- <object v-if="pdf" :data="pdf" type="application/pdf" height="100%" width="100%"/> -->
    <v-card height="100%" width="100%" class="tile" overflow-hidden>

      <!-- <adblock @passValue="add = $event"></adblock> -->
      <v-layout column fill-height v-if="pdf">
        <v-layout fill-height column>
          <!-- <div v-if="add !== ''"><b>Please disable ad blocker as it may interfere with printing.</b></div> -->
          <v-layout class="pl-4" row align-center wrap>
            <h3>Day Summary</h3>
            <v-spacer hidden-xs-only></v-spacer>
            <v-btn color="gray" @click="openEmailDialog" outline>{{
              $t('buttons.email')
            }}</v-btn>
            <v-btn color="gray" @click="download" outline>{{
              $t('buttons.saveAsPDF')
            }}</v-btn>
            <v-btn color="primary" @click="print" v-if="!embedPDF">{{
              $t('buttons.print')
            }}</v-btn>
          </v-layout>
          <v-flex v-if="pages > 1">
            <v-layout row>
              <v-layout column="" class="pdfButton">
                <v-btn
                  :disabled="currentPage === 1"
                  @click="currentPage = currentPage - 1"
                  >Previous</v-btn
                >
              </v-layout>

              <v-flex shrink> {{ currentPage }}/{{ pages }} </v-flex>
              <v-layout column="">
                <v-btn
                  class="pdfButton"
                  :disabled="currentPage === pages"
                  @click="currentPage = currentPage + 1"
                  >Next</v-btn
                >
              </v-layout>
            </v-layout>
          </v-flex>
          <embed
            id="embedPDF"
            v-if="embedPDF"
            :src="pdf"
            type="application/pdf"
            height="100%"
            min-width="100%"
          />
          <div
            v-if="!embedPDF"
            style="overflow: auto;background-color:gray"
            justify-center=""
          >
            <div class="capture" id="section-to-print" v-if="!embedPDF">
              <pdf-viewer
                v-if="pdf"
                :src="pdf"
                :page="currentPage"
                @numpages="setPages"
              ></pdf-viewer>
            </div>
          </div>
        </v-layout>
      </v-layout>
      <v-dialog v-model="emailInvoice.dialog" max-width="500px">
        <v-card>
          <v-card-text>
            <v-text-field
              :label="$t('labels.email')"
              v-model.trim="emailInvoice.email"
              :error-messages="emailErrors"
              @input="$v.emailInvoice.email.$touch()"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat @click="emailInvoice.dialog = false">{{
              $t('buttons.cancel')
            }}</v-btn>
            <v-btn color="blue darken-1" flat @click="email">{{
              $t('buttons.send')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-layout>
</template>
<script>
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfViewer from 'pdfvuer'
import { mapGetters } from 'vuex'
import reportService from '../service'
import extensions from '@/extensions/index.js'
import Loading from '../../../components/LoadingDialog'

const bwipjs = require('bwip-js')

pdfMake.vfs = pdfFonts.pdfMake.vfs

const { validationMixin } = require('vuelidate')
const { email } = require('vuelidate/lib/validators')

export default {
  name: 'report-location-day-summary',
  props: ['LocationId', 'dateTime'],
  data() {
    return {
      isLoading: false,
      report: null,
      pdf: null,
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
    pdfViewer,
    Loading,
  },
  watch: {
    dateTime: {
      handler() {
        this.loadReport()
      },
      immediate: true,
      deep: true,
    },
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
      this.$Progress.start()
      this.isLoading = true
      try {
        this.report = (
          await reportService.Location.daySummary({
            LocationId: this.LocationId,
            start: this.dateTime.start,
            end: this.dateTime.end,
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
                  text: `From: ${this.$moment(this.dateTime.start).format('MM/DD/YY hh:mm a')}`,
                  alignment: 'right',
                  fontSize: 8,
                  marging: [0, 10],
                },
                {
                  text: `To: ${this.$moment(this.dateTime.end).format('MM/DD/YY hh:mm a')}`,
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
    async print() {
      this.$Progress.start()
      if ('Bridge' in window) {
        alert('bridge found')
        window.Bridge.print()
      } else {
        try {
          await extensions.printer.printPDF(this.doc, this.printer)
          this.$Progress.finish()
        } catch (error) {
          this.$Progress.fail()
        }
      }
      if (!this.autoPrint) this.$emit('close')
    },
    download() {
      extensions.printer.printToPDF(this.doc)
    },
    openEmailDialog() {
      this.emailInvoice.dialog = true
    },
    email() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$toasted.error(this.$t('toastMessage.text.invalidFields'), {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 3500,
        })
      } else {
        pdfMake.createPdf(this.doc).getDataUrl(data => {
          const bodyFormData = new FormData()
          // const newFile = this.dataURLtoFile(data, `DaySummary_${this.report.location.code}.pdf`)
          const newFile = this.dataURLtoFile(data, `DaySummary_${this.location.code}.pdf`)
          bodyFormData.append('pdf', newFile)
          bodyFormData.append(
            'subject',
            `Report: ${this.location.name} - for ${this.start}`,
          )
          // bodyFormData.append('subject', `Report: ${this.report.location.name} - for ${this.start}`)
          bodyFormData.append('to', this.emailInvoice.email)
          bodyFormData.append('text', 'Attached is your receipt')
          reportService
            .sendReportPDF(bodyFormData)
            .then(response => {
              console.log(response)
              this.$toasted.success('Email Sent', {
                position: 'top-right',
                showHideTransition: 'slide',
                icon: 'check',
                duration: 2000,
              })
              this.$emit('close')
            })
            .catch(error => {
              this.$toasted.error(error.data.message, {
                position: 'top-right',
                showHideTransition: 'slide',
                icon: 'check',
                duration: 5000,
              })
            })
        })
      }
    },
    dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
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

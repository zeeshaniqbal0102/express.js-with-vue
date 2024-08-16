<template>
  <v-layout fill-height>
    <Loading :loading="isLoading"></Loading>
    <!-- <object v-if="pdf" :data="pdf" type="application/pdf" height="100%" width="100%"/> -->
    <v-card height="100%" width="100%" overflow-hidden>
      <!-- <adblock @passValue="add = $event"></adblock> -->
      <v-layout column fill-height v-if="pdf">
        <v-layout fill-height column>
          <!-- <div v-if="add !== ''"><b>Please disable ad blocker as it may interfere with printing.</b></div> -->
          <v-layout class="pl-4" row align-center wrap>
            <h3>Payments</h3>
            <v-spacer hidden-xs-only></v-spacer>
            <v-btn color="gray" @click="openEmailDialog" outline>{{
              $t('buttons.email')
            }}</v-btn>
            <v-btn color="gray" @click="download" outline v-if="!embedPDF">{{
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
import extensions from '@/extensions/index.js'
import reportService from '../service'
import Loading from '../../../components/LoadingDialog'

const bwipjs = require('bwip-js')

pdfMake.vfs = pdfFonts.pdfMake.vfs

const { validationMixin } = require('vuelidate')
const { email } = require('vuelidate/lib/validators')

export default {
  name: 'report-location-payments',
  props: ['location', 'dateTime'],
  data() {
    return {
      isLoading: false,
      report: null,
      pdf: null,
      doc: {
        info: {
          title: 'Payments',
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
                    text: `Payments Page ${currentPage.toString()} of ${pageCount}`,
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
  computed: {
    ...mapGetters('settings', ['embedPDF']),
    emailErrors() {
      const errors = []
      if (!this.$v.emailInvoice.email.$dirty) return errors
      if (!this.$v.emailInvoice.email.email) {
        errors.push(this.$t('validations.emailIsNotValid'))
      }
      return errors
    },
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
  methods: {
    setPages(val) {
      this.pages = val
    },
    async loadReport() {
      this.$Progress.start()
      this.isLoading = true
      try {
        this.doc.content = []
        this.report = (
          await reportService.Location.payments({
            LocationId: this.location.id,
            start: this.dateTime.start,
            end: this.dateTime.end,
          })
        ).data
        console.log('report', this.report)
        this.doc.pageSize = 'Letter'
        this.doc.info.title += ` ${this.location.name}`

        // Top Heading
        this.doc.content.push({
          columns: [
            {
              stack: [
                { text: this.location.name, fontSize: 12, bold: true },
                this.location.Address.addressLine1,
                this.location.Address.addressLine2,
                `${this.location.Address.city}, ${this.location.Address.State.name} ${this.location.Address.postalCode}`,
                this.$options.filters.phone(this.location.Address.phoneNumber),
              ],
              fontSize: 8,
            },
            {
              stack: [
                {
                  text: 'Payments',
                  alignment: 'right',
                  fontSize: 12,
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
        // Sale  by Category
        if (this.report) {
          const paymentMethodsHeaders = [[{ text: 'Name', colSpan: 2 }, '', 'Total']]

          let paymentAmountTotal = 0
          const paymentMethodsBody = await Promise.all(
            this.report.map(paymentMethod => {
              paymentAmountTotal += parseFloat(paymentMethod.totalPayments)
              return [
                { text: paymentMethod.name, colSpan: 2 },
                '',
                {
                  text: this.$options.filters.currency(paymentMethod.totalPayments),
                  alignment: 'right',
                },
              ]
            }),
          )

          const paymentTotalFooter = [
                [
                  { text: '', border: [false] },
                  { text: 'Total', alignment: 'center' },
                  {
                    text: this.$options.filters.currency(paymentAmountTotal),
                    alignment: 'right',
                  },
                ],
              ]
          // const saleByCategoryFooter = [[{border: [false, false, false, false], text: '' },{ text: 'Total', alignment: 'center'},categoryQuantityTotal, this.$options.filters.currency(categoryAmountTotal)]]
          this.doc.content.push({
            stack: [
              { text: 'Payments by Method', margin: [0, 10, 0, 5] },
              {
                table: {
                  widths: ['*', 'auto', 'auto'],
                  body: paymentMethodsHeaders.concat(paymentMethodsBody).concat(paymentTotalFooter),
                },
              },
            ],
            margin: [0, 10, 0, 0],
          })

          await Promise.all(
            this.report.map(async paymentMethod => {
              const paymentHeaders = [
                ['Date', 'Employee', 'Invoice #', 'Reference #', 'Amount'],
              ]
              const paymentBody = await Promise.all(
                paymentMethod.Payments.map(lineItem => {
                  const employee = lineItem.Employee.name
                  const { localId } = lineItem.Invoice
                  const date = this.$moment(lineItem.createdAt).format('MM/DD/YY hh:mm a')
                  const { amount } = lineItem
                  const { referenceNumber } = lineItem
                  return [
                    date,
                    employee,
                    localId,
                    referenceNumber,
                    { text: this.$options.filters.currency(amount), alignment: 'right' },
                  ]
                }),
              )
              const paymentFooter = [
                [
                  { border: [false, false, false, false], text: '', colSpan: 3 },
                  '',
                  '',
                  { text: 'Total', alignment: 'center' },
                  {
                    text: this.$options.filters.currency(paymentMethod.totalPayments),
                    alignment: 'right',
                  },
                ],
              ]
              if (paymentMethod.Payments.length > 0) {
                this.doc.content.push({
                  stack: [
                    { text: paymentMethod.name, margin: [0, 10, 0, 5] },
                    {
                      table: {
                        widths: ['auto', '*', 'auto', 'auto', 'auto'],
                        body: paymentHeaders.concat(paymentBody).concat(paymentFooter),
                      },
                    },
                  ],
                  margin: [0, 10, 0, 0],
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
          const newFile = this.dataURLtoFile(data, `Payments_${this.location.code}.pdf`)
          // const newFile = this.dataURLtoFile(data, `Payments_${this.report.location.code}.pdf`)
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

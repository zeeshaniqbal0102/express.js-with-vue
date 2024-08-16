<template>
<v-card height="100%" width="100%" overflow-hidden>
  <adblock @passValue="add = $event"></adblock>
  <v-layout column fill-height >
    <v-layout fill-height column >
      <div v-if="add !== ''"><b>Please disable ad blocker as it may interfere with printing.</b></div>
      <v-layout v-if="!embedPDF" style="overflow: auto;background-color:gray" justify-center="">
        <div class="capture" id="section-to-print" v-if="!embedPDF">
          <pdf-viewer height  v-if="pdf" :src="pdf" :page="currentPage" @numpages="setPages"></pdf-viewer>
        </div>
      </v-layout>
      <v-flex v-if="pages > 1">
        <v-layout row >
          <v-layout column="" class="pdfButton" >
            <v-btn :disabled="currentPage === 1" @click="currentPage = currentPage -1">Previous</v-btn>
          </v-layout>

          <v-flex shrink>
            {{currentPage}}/{{pages}}
          </v-flex>
          <v-layout column="">
            <v-btn class="pdfButton" :disabled="currentPage === pages" @click="currentPage = currentPage + 1">Next</v-btn>
          </v-layout>

        </v-layout>
      </v-flex>
      <embed id="embedPDF" v-if="embedPDF" :src="pdf" type="application/pdf" :height="height" min-width="100%"/>
      <v-layout row shrink wrap v-if="actions">
        <v-flex>
          <v-btn v-if="!hideclose" color="primary" @click="$emit('close')" flat>{{ $t('buttons.close') }}</v-btn>
        </v-flex>
        <v-spacer hidden-xs-only></v-spacer>
        <v-btn color="gray"  @click="openEmailDialog" outline>{{ $t('buttons.email') }}</v-btn>
        <v-btn color="gray" @click="download" outline v-if="!embedPDF" >{{ $t('buttons.saveAsPDF') }}</v-btn>
        <v-btn color="primary" @click="print" v-if="!embedPDF" >{{ $t('buttons.print') }}</v-btn>
      </v-layout>
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
          <v-btn color="red darken-1" flat @click="emailInvoice.dialog = false">{{ $t('buttons.cancel') }}</v-btn>
          <v-btn color="blue darken-1" flat @click="email">{{ $t('buttons.send') }}</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>

</template>
<script>
import adblock from 'vue-adblock'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfViewer from 'pdfvuer';
import { mapGetters } from 'vuex'
import terminalService from '../../api/backoffice'
import extensions from '../../extensions/index.js'
import constants from '../../config/constants'

const { validationMixin } = require('vuelidate')
const {
  email,
} = require('vuelidate/lib/validators')
const bwipjs = require('bwip-js');

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  name: 'receipt-invoice',
  props: ['actions', 'hideclose', 'invoice', 'qrcode', 'allowAutoPrint'],
  components: {
    pdfViewer,
    adblock,
  },
  data() {
    return {
      add: '',
      change: 0,
      emailInvoice: {
        dialog: false,
        email: '',
      },
      currentPage: 1,
      pages: 0,
      pdf: null,
      doc: {
        info: {
          title: 'Invoice Preview',
        },
        content: [],
        styles: {
          locationInfo: {
            alignment: 'center',
            fontSize: 8,
          },
          heading: {
            alignment: 'center',
            fontSize: 10,
          },
          topDetails: {
            margin: [0, 0],
            fontSize: 8,
          },
          invoiceDetails: {
            margin: [0, 2],
            fontSize: 8,
          },
          totals: {
            margin: [0, 0],
            fontSize: 8,
          },
        },
        pageBreakBefore(
          currentNode,
          followingNodesOnPage,
          nodesOnNextPage,
          previousNodesOnPage,
        ) {
          return (
            currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
          );
        },
      },
    };
  },
  computed: {
    ...mapGetters('settings', ['receiptPageSize', 'printer', 'autoPrint', 'embedPDF']),
    ...mapGetters('global', ['location']),
    ...mapGetters('register', ['paymentProcessorData']),
    width() {
      const size = (this.receiptPageSize) ? (parseInt(this.receiptPageSize.replace('[^0-9]', ''))) : 80
      const base = size / 0.35277
      const adjusted = base - (200 / base * 20)
      return adjusted
    },
    height() {
      if (this.pages > 0) {
        console.log('more pages')
        return this.pages * 600
      }
      return 2000
    },
    date() {
      return this.$moment(this.invoice.createdAt).format('MM/DD/YY h:mm a');
    },
    emailErrors() {
      const errors = []
      if (!this.$v.emailInvoice.email.$dirty) return errors
      if (!this.$v.emailInvoice.email.email) errors.push(this.$t('validations.emailIsNotValid'))
      return errors
    },
  },
  async created() {
    const canvas = document.createElement('canvas');

    const barcode = await new Promise((resolve, reject) => {
      bwipjs(canvas, {
        bcid: 'code128', // Barcode type
        text: this.invoice.localId.toString(), // Text to encode
        scale: 3, // 3x scaling factor
        height: 3, // Bar height, in millimeters
        includetext: false, // Show human-readable text
        textxalign: 'center', // Always good to set this
      }, async (err, cvs) => {
        if (err) {
          // Decide how to handle the error
          // `err` may be a string or Error object
          reject(err)
        } else {
          resolve(canvas.toDataURL('image/png'))
        }
      })
    })
    const qrbarcode = await new Promise((resolve, reject) => {
      bwipjs(canvas, {
        bcid: 'qrcode', // Barcode type
        text: this.invoice.entityId, // Text to encode
      }, (err, cvs) => {
        if (err) {
        // Decide how to handle the error
        // `err` may be a string or Error object
          reject(err)
        } else {
          resolve(canvas.toDataURL('image/png'))
        }
      });
    })

    const taxes = {}
    const PaymentProcessorInfo = []
    let itemCount = 0

    // getting change
    await Promise.all(this.invoice.Payments.map((payment) => {
      this.change += parseFloat(payment.change);
    }))
    this.doc.pageSize = { width: this.width, height: (this.printer.Star) ? 'auto' : this.height };
    this.doc.pageMargins = [10, 10, 10, 10];
    this.doc.pageOrientation = 'horizontal';
    // Logo
    if (this.invoice.Location.logoURL) {
      const toDataURL = url => fetch(url, { mode: 'cors' })
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }))
      const base64 = await toDataURL(this.invoice.Location.logoURL)
        .then(dataUrl => dataUrl)
      this.doc.content.push({
        image: base64,
        width: this.width * 0.9,
        alignment: 'center',
      })
    }
    // Location info
    this.doc.content.push({
      text: (this.invoice.Location.dba && this.invoice.Location.dba.trim !== '') ? this.invoice.Location.dba : this.invoice.Location.name,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: this.invoice.Location.Address.addressLine1,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: this.invoice.Location.Address.addressLine2,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: this.invoice.Location.Address.addressLine2,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: `${this.invoice.Location.Address.city}, ${this.invoice.Location.Address.State.code.substr(this.invoice.Location.Address.State.code.indexOf('-') + 1)} ${this.invoice.Location.Address.postalCode}`,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: this.$options.filters.phone(this.invoice.Location.Address.phoneNumber),
      style: 'locationInfo',
    });
    if (this.invoice.Location.website) {
      this.doc.content.push({
        text: this.invoice.Location.website,
        style: 'locationInfo',
      });
    }
    if (this.invoice.Location.DCALicense) {
      this.doc.content.push({
        text: `DCA ${this.invoice.Location.DCALicense}`,
        style: 'locationInfo',
      });
    }
    // Receipt Metadata
    this.doc.content.push({
      columns: [
        { text: 'Date', alignment: 'left' },
        { text: this.date, alignment: 'right' },
      ],
      margin: [0, 10, 0, 0],
      style: 'topDetails',
    });
    this.doc.content.push({
      columns: [
        { text: 'Invoice', alignment: 'left' },
        { text: this.invoice.localId, alignment: 'right' },
      ],
      style: 'topDetails',
    });
    this.doc.content.push({
      columns: [
        { text: 'ShiftId', alignment: 'left' },
        { text: this.invoice.ShiftId, alignment: 'right' },
      ],
      style: 'topDetails',
    })
    this.doc.content.push({
      columns: [
        { text: 'Employee', alignment: 'left' },
        { text: `${this.invoice.Employee.firstName} ${(this.invoice.Employee.lastName) ? `${this.invoice.Employee.lastName.charAt(0)}.` : ''}`, alignment: 'right' },
      ],
      style: 'topDetails',
    })
    this.doc.content.push({
      columns: [
        { text: 'Type', alignment: 'left' },
        { text: this.invoice.type, alignment: 'right' },
      ],
      style: 'topDetails',
    })
    // Detail Header
    this.doc.content.push({
      columns: [
        { text: 'Qty', width: this.width * 0.10 },

        { text: 'Name', alignment: 'left', width: (this.width > 200) ? this.width * 0.60 : this.width * 0.45 },
        { text: 'Total', alignment: 'right' },
      ],
      style: 'invoiceDetails',
      bold: true,
    });
    // Details
    await Promise.all(
      this.invoice.InvoiceDetails.map(async (detail) => {
        // We are going to use this loop to tally the items
        itemCount += parseFloat(detail.quantity)
        // And to get the taxes
        await Promise.all(detail.InvoiceDetailTaxes.map((tax) => {
          if (tax.apply) {
            const taxAmount = (tax.type === 'PERCENTAGE') ? parseFloat(detail.subTotal) * parseFloat(tax.percentage) / 100 : parseFloat(detail.quantity) * parseFloat(tax.amount)
            if (tax.TaxTemplate.name in taxes) {
              taxes[tax.TaxTemplate.name] += taxAmount
            } else {
              taxes[tax.TaxTemplate.name] = taxAmount
            }
          }
        }))
        let taxSymbol = ''
        const columns = [
          { text: `${parseFloat(detail.quantity)}x`, width: this.width * 0.10 },
          { text: detail.name, alignment: 'left', width: (this.width > 200) ? this.width * 0.60 : this.width * 0.45 },
        ]
        // todo: Add symbol if turned on in settings
        if (parseFloat(detail.taxTotal) !== 0) {
          taxSymbol = ' T'
        }
        switch (detail.InvoiceDetailTypeId) {
          case constants.INVOICEDETAILTYPES.DISCOUNT:
            columns.push({
              text: `(${this.$options.filters.currency(detail.subTotal)})${taxSymbol}`,
              alignment: 'right',
            })
            break
          default:
            columns.push({
              text: `${this.$options.filters.currency(detail.subTotal * detail.quantity)}${taxSymbol}`,
              alignment: 'right',
            })
        }

        this.doc.content.push({
          columns,
          style: 'invoiceDetails',
        })

        // Sub row
        const subRowColumns = []
        if ((parseFloat(detail.quantity) !== 1) || (detail.weight)) {
          subRowColumns.push({
            text: `@ ${this.$options.filters.currency(detail.subTotal)}`,
            alignment: 'left',
            margin: [10, 0, 0, 0],
          })
        }
        if (subRowColumns.length > 0) {
          this.doc.content.push({
            columns: subRowColumns,
            style: 'invoiceDetails',
          })
        }
        if (detail.discount && (parseFloat(detail.discount) !== 0) && (detail.InvoiceDetailTypeId !== constants.INVOICEDETAILTYPES.DISCOUNT)) {
          this.doc.content.push({
            columns: [
              {
                text: (detail.metadata && detail.metadata.isCashDiscount) ? 'Cash Discount' : `-${this.$options.filters.currency(detail.discount)}${taxSymbol} ea`,
                alignment: 'center',
              },
              {
                text: `-${this.$options.filters.currency(detail.discount * detail.quantity)}`,
                alignment: 'right',
              },
            ],
            style: 'invoiceDetails',
          })
        }
        if (detail.metadata && detail.metadata.modifiers) {
          await Promise.all(Object.keys(detail.metadata.modifiers).map(async (modifier) => {
            if (detail.metadata.modifiers[modifier].defaults) {
              await Promise.all(detail.metadata.modifiers[modifier].defaults.map((option) => {
                if (detail.metadata.modifiers[modifier].options[option]) {
                  this.doc.content.push({
                    columns: [
                      {
                        text: option,
                        alignment: 'center',
                      },
                      {
                        text: `${this.$options.filters.currency(detail.metadata.modifiers[modifier].options[option].price)}`,
                        alignment: 'center',
                      },
                    ],
                    style: 'invoiceDetails',
                  })
                }
              }))
            } else if (detail.metadata.modifiers[modifier].options[detail.metadata.modifiers[modifier].default]) {
              this.doc.content.push({
                columns: [
                  {
                    text: detail.metadata.modifiers[modifier].default,
                    alignment: 'center',
                  },
                  {
                    text: `${this.$options.filters.currency(detail.metadata.modifiers[modifier].options[detail.metadata.modifiers[modifier].default].price)}`,
                    alignment: 'center',
                  },
                ],
                style: 'invoiceDetails',
              })
            }
          }))
        }
        // Bill Payment SubObject
        if (detail.BillPayment && detail.BillPayment.id) {
          this.doc.content.push({
            columns: [
              { text: 'Carrier:', alignment: 'left' },
              { text: detail.BillPayment.Carrier.name, alignment: 'left' },
              { text: '', alignment: 'left' },
            ],
            style: 'invoiceDetails',
          })
          this.doc.content.push({
            columns: [
              { text: 'PhoneNumber:', alignment: 'left' },
              { text: detail.BillPayment.phoneNumber, alignment: 'left' },
              { text: '', alignment: 'left' },
            ],
            style: 'invoiceDetails',
          })
        }
      }),
    )
    // Totals
    this.doc.content.push({
      columns: [
        { text: 'Item Count', alignment: 'right' },
        {
          text: itemCount,
          alignment: 'right',
        },
      ],
      margin: [0, 5, 0, 5],
      bold: true,
      style: 'totals',
    })
    this.doc.content.push({
      columns: [
        { text: 'Sub Total', alignment: 'right' },
        {
          text: this.$options.filters.currency(this.invoice.subTotal),
          alignment: 'right',
        },
      ],
      bold: true,
      style: 'totals',
    })
    if (parseFloat(this.invoice.discountTotal) !== 0) {
      this.doc.content.push({
        columns: [
          { text: 'Discounts', alignment: 'right' },
          {
            text: `-${this.$options.filters.currency(this.invoice.discountTotal)}`,
            alignment: 'right',
          },
        ],
        bold: true,
        style: 'totals',
      })
    }
    await Promise.all(Object.keys(taxes).map((tax) => {
      this.doc.content.push({
        columns: [
          { text: tax, alignment: 'right' },
          {
            text: this.$options.filters.currency(taxes[tax]),
            alignment: 'right',
          },
        ],
        bold: true,
        style: 'totals',
      })
    }))
    if (this.invoice.surchargeTotal && parseFloat(this.invoice.surchargeTotal) !== 0) {
      this.doc.content.push({
        columns: [
          { text: 'Surcharge', alignment: 'right' },
          {
            text: this.$options.filters.currency(this.invoice.surchargeTotal),
            alignment: 'right',
          },
        ],
        bold: true,
        style: 'totals',
      })
    }
    this.doc.content.push({
      columns: [
        { text: 'Grand Total', alignment: 'right' },
        {
          text: this.$options.filters.currency(this.invoice.grandTotal),
          alignment: 'right',
        },
      ],
      bold: true,
      style: 'totals',
    })
    this.doc.content.push({
      table: {
        widths: ['*'],
        body: [[' '], [' ']],
      },
      layout: {
        hLineWidth(i, node) {
          return (i === 0 || i === node.table.body.length) ? 0 : 1;
        },
        vLineWidth(i, node) {
          return 0;
        },
      },
    })
    await Promise.all(this.invoice.Payments.map((payment) => {
      this.doc.content.push({
        columns: [
          { text: payment.PaymentMethod.name, alignment: 'right' },
          {
            text: this.$options.filters.currency(payment.tender),
            alignment: 'right',
          },
        ],
        bold: true,
        style: 'totals',
      })
      // Add Payment processor info onto the receipt
      switch (payment.PaymentProcessorId) {
        case 1:
          if (payment.metadata && payment.metadata.ExtData) {
            const extData = JSON.parse(payment.metadata.ExtData)
            PaymentProcessorInfo.push({
              [extData.CardType]: extData.EntryType,
              Amount: extData.Amount,
              'Last 4': extData.AcntLast4,
              Resp: payment.metadata.RespMSG,
              Code: payment.metadata.AuthCode,
              PNRef: payment.metadata.PNRef,
              Ref: payment.metadata.RefId,
              Signature: payment.metadata.Sign,
            })
          }
      }
    }))
    this.doc.content.push({
      columns: [
        { text: 'Change', alignment: 'right' },
        {
          text: this.$options.filters.currency(this.change),
          alignment: 'right',
        },
      ],
      bold: true,
      style: 'totals',
    })
    this.doc.content.push({
      table: {
        widths: ['*'],
        body: [[' '], [' ']],
      },
      layout: {
        hLineWidth(i, node) {
          return (i === 0 || i === node.table.body.length) ? 0 : 1;
        },
        vLineWidth(i, node) {
          return 0;
        },
      },
    })
    if (barcode) {
      this.doc.content.push({
        image: barcode,
        width: this.width * 0.6,
        alignment: 'center',
      })
    }
    // Payment Processor Info
    await Promise.all(
      PaymentProcessorInfo.map(async (info) => {
        await Promise.all(Object.keys(info).map((key) => {
          if (key === 'Signature') {
            if (info[key]) {
            // No signature found but key passed
              this.doc.content.push({
                columns: [
                  {
                    text: 'x',
                    alignment: 'left',
                    width: 10,
                  },
                  {
                    table: {
                      widths: ['*'],
                      body: [[' '], [' ']],
                    },
                    layout: {
                      hLineWidth(i, node) {
                        return (i === 0 || i === node.table.body.length) ? 0 : 1;
                      },
                      vLineWidth(i, node) {
                        return 0;
                      },
                    },
                    alignment: 'center',
                  },
                ],
                margin: [0, 10, 0, 0],
              })
              this.doc.content.push({
                columns: [
                  {
                    text: 'Signature',
                    alignment: 'center',
                  },
                ],
                style: 'totals',
              })
            } else {
              // Todo Print Signature
            }
            this.doc.content.push({
              columns: [
                {
                  text: 'CARDHOLDER WILL PAY CARD ISSUER ABOVE AMOUNT PURSUANT TO CARDHOLDER AGREEMENT',
                  alignment: 'center',
                },
              ],
              style: 'totals',
              margin: [0, 10, 0, 0],
            })
          } else {
            this.doc.content.push({
              columns: [
                { text: key, alignment: 'left' },
                {
                  text: info[key],
                  alignment: 'right',
                },
              ],
              style: 'totals',
            })
          }
        }))
        this.doc.content.push({
          columns: [
            {
              text: 'IMPORTANT -- retain this copy for your records',
              alignment: 'center',
            },
          ],
          style: 'totals',
          margin: [0, 10, 0, 10],
        })
      }),
    )
    // Policies
    await Promise.all(
      this.invoice.Policies.map((policy) => {
        this.doc.content.push({
          text: policy.title,
          style: 'heading',
          bold: true,
        });
        this.doc.content.push({
          text: policy.text,
          style: 'locationInfo',
        });
      }),
    )

    if (this.invoice.Location.Options && this.invoice.Location.Options.globalPolicy) {
      this.doc.content.push({
        text: this.invoice.Location.Options.globalPolicy,
        margin: [0, 10, 0, 10],
        alignment: 'center',
        fontSize: 10,
      });
    }
    if (this.qrcode) {
      this.doc.content.push({
        image: qrbarcode,
        width: this.width * 0.2,
        alignment: 'center',
        margin: [10, 10, 10, 10],
      })
    }

    pdfMake.createPdf(this.doc).getDataUrl((data) => {
      this.pdf = data;
      if (this.allowAutoPrint && this.autoPrint && !this.embedPDF) {
        setTimeout(() => { this.print(); }, 500);
      }
    })
  },
  methods: {
    setPages(val) {
      this.pages = val
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
      if (this.invoice.Contact && this.invoice.Contact.email) {
        this.emailInvoice.email = this.invoice.Contact.email
      }
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
        pdfMake.createPdf(this.doc).getDataUrl((data) => {
          const bodyFormData = new FormData()
          const newFile = this.dataURLtoFile(data, `Invoice_${this.invoice.localId}.pdf`)
          bodyFormData.append('pdf', newFile)
          bodyFormData.append('subject', `RECEIPT: ${this.invoice.localId} - Thank for shopping at ${this.invoice.Location.name}`)
          bodyFormData.append('to', this.emailInvoice.email)
          bodyFormData.append('text', 'Attached is your receipt')
          terminalService.sendReceiptPDF(bodyFormData)
            .then((response) => {
              console.log(response)
              this.$toasted.success('Email Sent', {
                position: 'top-right',
                showHideTransition: 'slide',
                icon: 'check',
                duration: 2000,
              })
              this.$emit('close')
            })
            .catch((error) => {
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
};
</script>
<style scoped>
@media print {
  body * {
    visibility: hidden;
    margin: 0,;
  padding: 0;
  }
  #section-to-print, #section-to-print * {
    visibility: visible;
  }
  #section-to-print {
    position: fixed;
    left: 0;
    top: 0;
  }
}
.pdfButton > .v-btn {
  margin: 0,;
  padding: 0;
  color: blue
}
</style>

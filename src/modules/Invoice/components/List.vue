<template>
  <v-container fluid>
    <SearchBar v-model="search" />
    <v-card flat class="outlined">
      <v-toolbar :color="$style.card.header" class="elevation-0">
        <v-toolbar-title>
          <v-layout column fill-height>
            <span class="title">{{ $t('pageHeader.reviewInvoice') }}</span>
          </v-layout>
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <!-- <v-toolbar v-if="!hideHeader" height="45" class="elevation-0" color="gray">
      <v-toolbar-title>
        <h1 class="title font-weight-regular">{{ $t('pageHeader.reviewInvoice') }}</h1>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-title>
      <v-layout>
        <v-flex xs12 sm6 md4>
          <v-text-field
            :append-icon="`${(search) ? 'close' : 'search'}`"
            @click:append="search = ''"
            v-model="search"
            label="Search"
            single-line
            hide-details
          />
        </v-flex>
      </v-layout>
    </v-card-title> -->

      <v-data-table
        :headers="headers"
        :items="invoices"
        class="table-header"
        :pagination.sync="pagination"
        :total-items="count"
        :loading="loading"
        :rows-per-page-items="rowsPerPageItems"
        expand
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">
            {{ props.item.createdAt | moment('L LT') }}
          </td>
          <td class="text-xs-left">{{ props.item.Location.name }}</td>
          <td class="text-xs-left">{{ props.item.localId }}</td>
          <td class="text-xs-left">
            {{ props.item.Contact ? props.item.Contact.fullName : 'Walk-in customer' }}
          </td>
          <td class="text-xs-right">{{ props.item.subTotal | currency }}</td>
          <td class="text-xs-right">{{ props.item.taxTotal | currency }}</td>
          <td class="text-xs-right">{{ props.item.grandTotal | currency }}</td>
          <td class="justify-end layout px-0">
            <v-menu bottom left offset-y>
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list class="menu-button">
                <v-list-tile @click="viewInvoice(props.item)">
                  <v-list-tile-title>{{ $t('buttons.view') }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="voidInvoice(props.item)">
                  <v-list-tile-title>{{ $t('buttons.void') }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </template>
      </v-data-table>
      <v-dialog v-model="viewInvoiceDialog" fullscreen>
        <InvoiceReceipt
          v-if="viewInvoiceModal"
          :invoice="viewInvoiceModal"
          :actions="true"
          @close="viewInvoiceDialog = false"
        ></InvoiceReceipt>
      </v-dialog>
    </v-card>
  </v-container>
</template>
<script>
import invoiceService from '../service'
import InvoiceReceipt from '../../Receipts/Invoice'
import { PAYMENTMETHOD, PAYMENTPROCESSOR } from '../../../config/constants.js'

export default {
  name: 'invoice-list',
  props: ['ContactId', 'hideHeader'],
  components: {
    InvoiceReceipt,
  },
  data() {
    return {
      startDatePicker: {
        dialog: false,
        date: null,
      },
      endDatePicker: {
        dialog: false,
        date: null,
      },
      headers: [
        {
          text: this.$t('labels.date'),
          align: 'left',
          sortable: false,
          value: 'createdAt',
          width: '20%',
        },
        {
          text: this.$t('labels.location'),
          align: 'left',
          sortable: false,
          value: 'Location.name',
        },
        {
          text: this.$t('labels.invoice'),
          align: 'left',
          sortable: false,
          value: 'localId',
        },
        {
          text: this.$t('labels.customer'),
          value: 'fullName',
          sortable: true,
        },
        {
          text: this.$t('labels.subTotal'),
          value: 'subTotal',
          sortable: false,
        },
        {
          text: this.$t('labels.tax'),
          value: 'tax',
          sortable: false,
        },
        {
          text: this.$t('labels.grandTotal'),
          value: 'grandTotal',
          sortable: false,
        },
        {
          text: '',
          value: 'action',
          sortable: false,
        },
      ],
      search: null,
      invoices: [],
      count: 0,
      limit: 10,
      offset: 0,
      loading: false,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'name',
      },
      viewInvoiceDialog: false,
      viewInvoiceModal: null,
      voidPaymentDialog: false,
      voidPaymentModel: null,
      voidAmount: 0,
      paymentProcessor: null,
    }
  },
  computed: {
    startDateFormatted: {
      get() {
        if (this.startDatePicker.date) {
          return this.$moment(this.startDatePicker.date).format('MM/DD/YYYY')
        }
        return null
      },
      set() {
        this.startDatePicker.date = null
      },
    },
    endDateFormatted: {
      get() {
        if (this.endDatePicker.date) {
          return this.$moment(this.endDatePicker.date).format('MM/DD/YYYY')
        }
        return null
      },
      set() {
        this.endDatePicker.date = null
      },
    },
  },
  watch: {
    startDateFormatted() {
      this.getList()
    },
    endDateFormatted() {
      this.getList()
    },
    search() {
      if (this.search.length > 3 || this.search.length === 0) {
        this.getList()
      }
    },
    pagination: {
      handler() {
        this.pagination.totalItems = this.count
        this.getList()
      },
      deep: true,
    },
  },
  methods: {
    getList() {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return invoiceService
        .getAll({
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          start: this.$moment(this.startDatePicker.date)
            .startOf('day')
            .utc()
            .toISOString(),
          end: this.$moment(this.endDatePicker.date)
            .endOf('day')
            .utc()
            .toISOString(),
          orderBy: [this.pagination.sortBy, this.pagination.descending],
          contactId: this.ContactId,
          includeLocation: true,
        })
        .then(response => {
          this.invoices = response.data
          this.count = response.count
          this.loading = false
          return response
        })
    },
    editProduct(invoice) {
      this.$router.push({ name: 'invoice-edit', params: invoice })
    },
    refundInvoice(invoice) {
      this.$router.push({
        name: 'register-main',
        params: { invoice, refund: true },
      })
    },
    resetVoidDialog() {
      this.$Progress.finish()
      this.voidPaymentDialog = false
      this.voidAmount = 0
      this.voidPaymentModel = null
      this.voidInvoiceModel = null
      this.paymentProcessor = null
    },
    saveVoidInfo(val) {
      this.voidDBInvoice(this.voidInvoiceModel)
      this.resetVoidDialog()
    },
    /**
     * Starts a void flow. Checks if credit cards were used and runs those voids first then finishes with the database void
     */
    voidInvoice(invoice) {
      this.voidInvoiceModel = invoice
      this.$swal({
        title: 'Are you sure?',
        text:
          "You won't be able to revert this! Card payments will not be voided on the customer's end.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(async result => {
        if (result.value) {
          this.$Progress.start()
          // before void lets make sure there are no credit card transactions that need voiding
          // const fullInvoiceResponse = await invoiceService.getById(invoice.id)
          // const payments = fullInvoiceResponse.data.Payments
          // await Promise.all(payments.map(async (payment) => {
          //   switch (payment.PaymentMethodId) {
          //     case PAYMENTMETHOD.CREDITCARD:
          //     case PAYMENTMETHOD.DEBITCARD:
          //       switch (payment.PaymentProcessorId) {
          //         case PAYMENTPROCESSOR.MERCHANTINDUSTRYDEJAVOO:
          //           this.voidAmount = parseFloat(payment.amount)
          //           this.voidPaymentDialog = true
          //           this.voidPaymentModel = payment
          //           this.paymentProcessor = Dejavoo
          //           break
          //       }
          //       break
          //     default:
          //       this.voidDBInvoice(invoice)
          //   }
          // }))
          await this.voidDBInvoice(invoice)
        }
      })
    },
    /**
     * Voids the invoice from the database
     */
    async voidDBInvoice(invoice) {
      return invoiceService
        .void(invoice.id)
        .then(response => {
          this.$Progress.finish()
          if (response.data) {
            this.$swal('Voided!', 'Invoice was voided', 'success')
            this.getList()
          }
        })
        .catch(error => {
          this.$toasted.error(error.data.message, {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'error',
            duration: 2000,
          })
          this.$Progress.fail()
        })
    },
    viewInvoice(invoice) {
      this.viewInvoiceModal = null
      this.$Progress.start()
      invoiceService
        .getById(invoice.id)
        .then(response => {
          this.viewInvoiceModal = response.data
          this.viewInvoiceDialog = true
          this.$Progress.finish()
        })
        .catch(error => {
          this.$toasted.error(error.data.message, {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'error',
            duration: 2000,
          })
          this.$Progress.fail()
        })
    },
  },
}
</script>
